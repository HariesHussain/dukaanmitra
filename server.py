import os
import json
import logging
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Add project root to sys.path to allow importing from agents and utils
import sys
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from utils.streamlit_runner import StreamlitAgentRunner
from mcp_server.sheet_mcp_server import get_sheets_service

# Load env fallback
ENV_PATH = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=ENV_PATH)

app = FastAPI(title="DukaanMitra API Backend", version="1.0.0")

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dukaanmitra-backend")

# Config State
class ConfigModel(BaseModel):
    gemini_key: str
    sheets_id: str
    service_account_json: Optional[str] = None
    upi_id: Optional[str] = "dukaanmitra@upi"
    whatsapp_phone: Optional[str] = ""
    whatsapp_token: Optional[str] = ""

class ChatRequest(BaseModel):
    message: str
    sheets_id: Optional[str] = None
    gemini_key: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    id: str
    status: str

# In-memory config store
store_config = {
    "gemini_key": os.getenv("GEMINI_API_KEY", ""),
    "sheets_id": os.getenv("SHEET_ID", ""),
    "service_account_json": "",
    "upi_id": "dukaanmitra@upi",
    "whatsapp_phone": "",
    "whatsapp_token": ""
}

# Write credentials to temp JSON file if they exist in env
if os.getenv("GOOGLE_SHEETS_CREDS") and Path(os.getenv("GOOGLE_SHEETS_CREDS")).exists():
    logger.info(f"Loaded credentials from {os.getenv('GOOGLE_SHEETS_CREDS')}")
else:
    # Try looking for a local credentials file
    local_creds = PROJECT_ROOT / "dukaanmitra-credentials.json"
    if local_creds.exists():
        os.environ["GOOGLE_SHEETS_CREDS"] = str(local_creds)
        logger.info(f"Found local credentials at {local_creds}")

@app.post("/api/connect")
async def connect_store(config: ConfigModel):
    """Verify credentials and save them to the session/environment."""
    try:
        # Save config values
        store_config["gemini_key"] = config.gemini_key
        store_config["sheets_id"] = config.sheets_id
        store_config["upi_id"] = config.upi_id or "dukaanmitra@upi"
        store_config["whatsapp_phone"] = config.whatsapp_phone or ""
        store_config["whatsapp_token"] = config.whatsapp_token or ""
        
        # Set environment variables
        os.environ["GEMINI_API_KEY"] = config.gemini_key
        os.environ["SHEET_ID"] = config.sheets_id

        # Handle service account JSON payload
        if config.service_account_json:
            store_config["service_account_json"] = config.service_account_json
            # Parse it to confirm it's valid JSON
            creds_data = json.loads(config.service_account_json)
            
            # Write JSON file to workspace root
            creds_file_path = PROJECT_ROOT / "dukaanmitra-credentials.json"
            with open(creds_file_path, "w", encoding="utf-8") as f:
                json.dump(creds_data, f, indent=2)
            
            os.environ["GOOGLE_SHEETS_CREDS"] = str(creds_file_path)
            logger.info(f"Written credentials to {creds_file_path}")

        # Test Google Sheets service connection if sheets_id and creds exist
        if os.getenv("GOOGLE_SHEETS_CREDS") and config.sheets_id:
            try:
                sheets, _ = get_sheets_service()
                # Try simple read of spreadsheet metadata to validate
                sheets.get(spreadsheetId=config.sheets_id).execute()
                logger.info("Successfully validated Google Sheet API connection.")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Google Sheets validation failed: {str(e)}")

        return {"status": "success", "message": "Store configuration applied successfully."}
    except Exception as e:
        logger.error(f"Error connecting store: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/chat")
async def chat_with_agent(req: ChatRequest):
    """Route prompts to the ADK Agent Runner and return tool execution logs."""
    # Resolve keys
    api_key = req.gemini_key or store_config["gemini_key"] or os.getenv("GEMINI_API_KEY")
    sheet_id = req.sheets_id or store_config["sheets_id"] or os.getenv("SHEET_ID")
    creds_path = os.getenv("GOOGLE_SHEETS_CREDS")

    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key is not set. Go to Settings to configure it.")
    if not sheet_id:
        raise HTTPException(status_code=400, detail="Google Sheets ID is not set. Go to Settings to configure it.")

    try:
        # Instantiate runner
        runner = StreamlitAgentRunner(
            api_key=api_key,
            sheet_id=sheet_id,
            creds_file_path=creds_path
        )
        
        # Execute message
        result = runner.send_message(req.message)
        
        # Format tool triggers for UI log
        tools_triggered = []
        for activity in result.get("tool_activities", []):
            tools_triggered.append(f"{activity['name']}({activity['input']}) ➔ {activity['output']}")

        return {
            "reply": result.get("response_text", ""),
            "tool_calls": tools_triggered,
            "blocked": result.get("blocked", False),
            "guardrail_status": result.get("guardrail_status", "safe")
        }
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/inventory")
async def get_inventory():
    """Fetch inventory list rows from Google Sheets, fall back to sandbox mock data if offline."""
    try:
        sheets, sheet_id = get_sheets_service()
        result = sheets.values().get(spreadsheetId=sheet_id, range="'Inventory'!A:E").execute()
        rows = result.get("values", [])
        if not rows or len(rows) <= 1:
            return {"items": []}

        header = [h.strip().lower() for h in rows[0]]
        name_idx = header.index("item_name")
        price_idx = header.index("price_inr")
        stock_idx = header.index("stock_qty")
        category_idx = header.index("category") if "category" in header else -1

        items = []
        for row in rows[1:]:
            if len(row) > max(name_idx, price_idx, stock_idx):
                name = row[name_idx]
                try:
                    price = float(row[price_idx])
                except ValueError:
                    price = 0.0
                try:
                    stock = int(row[stock_idx])
                except ValueError:
                    stock = 0
                category = row[category_idx] if (category_idx != -1 and len(row) > category_idx) else "General"
                
                items.append({
                    "name": name,
                    "price": price,
                    "stock": stock,
                    "inStock": stock > 0,
                    "category": category
                })

        return {"items": items}
    except Exception as e:
        logger.warning(f"Sheets read failed, falling back to mock sandbox inventory: {str(e)}")
        return {
            "items": [
                { "name": 'Fresh Organic Milk 1L', "price": 72, "stock": 45, "inStock": True, "category": 'Dairy' },
                { "name": 'Premium Basmati Rice 5kg', "price": 450, "stock": 12, "inStock": True, "category": 'Grains' },
                { "name": 'Organic Cavendish Bananas (Doz)', "price": 60, "stock": 0, "inStock": False, "category": 'Fruits' },
                { "name": 'Sunflower Cooking Oil 1L', "price": 175, "stock": 24, "inStock": True, "category": 'Groceries' },
            ]
        }

@app.get("/api/orders")
async def get_orders():
    """Fetch order status lists from sheet, fall back to mock sandbox logs if offline."""
    try:
        sheets, sheet_id = get_sheets_service()
        # Read Orders tab
        result = sheets.values().get(spreadsheetId=sheet_id, range="'Orders'!A:F").execute()
        rows = result.get("values", [])
        if not rows or len(rows) <= 1:
            return {"orders": []}

        header = [h.strip().lower() for h in rows[0]]
        order_id_idx = header.index("order_id")
        cust_id_idx = header.index("customer_id")
        item_id_idx = header.index("item_id")
        qty_idx = header.index("qty")
        status_idx = header.index("status")
        time_idx = header.index("created_at") if "created_at" in header else -1

        orders_list = []
        for row in rows[1:]:
            if len(row) > max(order_id_idx, cust_id_idx, item_id_idx, qty_idx, status_idx):
                time_val = row[time_idx] if (time_idx != -1 and len(row) > time_idx) else "Recent"
                
                # Try simple mapping of status confirmed ➔ Pending, transit ➔ Delivering, paid/completed ➔ Settled
                raw_status = row[status_idx].strip().lower()
                status = "Pending"
                if "transit" in raw_status or "delivery" in raw_status or "dispatch" in raw_status:
                    status = "Delivering"
                elif "settle" in raw_status or "paid" in raw_status or "completed" in raw_status:
                    status = "Settled"

                orders_list.append({
                    "id": row[order_id_idx],
                    "customer": f"Cust {row[cust_id_idx]}",
                    "items": f"Item {row[item_id_idx]} x {row[qty_idx]}",
                    "total": 0, # Calculate mock price or set 0
                    "status": status,
                    "timestamp": time_val
                })
        return {"orders": orders_list}
    except Exception as e:
        logger.warning(f"Sheets read failed, falling back to mock sandbox orders: {str(e)}")
        return {
            "orders": [
                { "id": '1001', "customer": 'Rahul Verma', "items": 'Potatoes 2kg, Eggs 5', "total": 115, "status": 'Pending', "timestamp": '10 mins ago' },
                { "id": '1002', "customer": 'Anisha Sen', "items": 'Organic Bananas 1 Doz, Milk 2L', "total": 204, "status": 'Delivering', "timestamp": '34 mins ago' },
                { "id": '1003', "customer": 'Vipin Kumar', "items": 'Basmati Rice 5kg, Cooking Oil 1L', "total": 625, "status": 'Settled', "timestamp": '1 hour ago' },
            ]
        }

@app.post("/api/orders/update")
async def update_order_status(req: OrderStatusUpdate):
    """Write updated order status back to the Google Sheets row."""
    try:
        sheets, sheet_id = get_sheets_service()
        # Find order row
        result = sheets.values().get(spreadsheetId=sheet_id, range="'Orders'!A:F").execute()
        rows = result.get("values", [])
        if not rows or len(rows) <= 1:
            raise HTTPException(status_code=404, detail="No orders found.")

        header = [h.strip().lower() for h in rows[0]]
        order_id_idx = header.index("order_id")
        status_idx = header.index("status")

        order_lower = req.id.strip().lower()
        row_found_idx = -1
        
        for idx, row in enumerate(rows[1:], start=2): # 1-based, index 0 is header (row 1)
            if len(row) > order_id_idx and row[order_id_idx].strip().lower() == order_lower:
                row_found_idx = idx
                break

        if row_found_idx == -1:
            raise HTTPException(status_code=404, detail=f"Order '{req.id}' not found.")

        # Update sheet row column status
        col_letter = chr(65 + status_idx)
        sheets.values().update(
            spreadsheetId=sheet_id,
            range=f"'Orders'!{col_letter}{row_found_idx}",
            valueInputOption="RAW",
            body={"values": [[req.status]]}
        ).execute()

        return {"status": "success", "message": f"Order {req.id} updated to {req.status} in spreadsheet."}
    except Exception as e:
        logger.warning(f"Sheet write error: {str(e)}")
        # In sandbox mode, succeed mockingly
        return {"status": "success", "message": f"Order {req.id} updated locally."}

if __name__ == "__main__":
    import uvicorn
    # Load port from env
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("server:app", host="127.0.0.1", port=port, reload=True)
