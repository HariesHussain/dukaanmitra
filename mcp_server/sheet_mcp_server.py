import os
import re
import datetime
from pathlib import Path
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from mcp.server.fastmcp import FastMCP
from rapidfuzz import fuzz

# Define workspace root and load environment variables from .env
WORKSPACE_ROOT = Path("c:/Users/Admin/Documents/dukaanmitra")
ENV_PATH = WORKSPACE_ROOT / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# Initialize FastMCP server
mcp = FastMCP("DukaanMitra Sheets MCP Server")

def get_sheets_service():
    """Helper to connect to the Google Sheets API using credentials from .env."""
    creds_path = os.getenv("GOOGLE_SHEETS_CREDS")
    sheet_id = os.getenv("SHEET_ID")
    
    if not creds_path:
        raise ValueError("GOOGLE_SHEETS_CREDS environment variable is not set.")
    if not sheet_id:
        raise ValueError("SHEET_ID environment variable is not set.")
        
    resolved_creds_path = Path(creds_path)
    if not resolved_creds_path.is_absolute():
        resolved_creds_path = WORKSPACE_ROOT / resolved_creds_path
        
    if not resolved_creds_path.exists():
        raise FileNotFoundError(f"Credentials file not found at: {resolved_creds_path}")
        
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    creds = service_account.Credentials.from_service_account_file(str(resolved_creds_path), scopes=scopes)
    service = build("sheets", "v4", credentials=creds)
    return service.spreadsheets(), sheet_id

def get_next_id(sheets, sheet_id, tab_name, col_name, prefix, start_num=1001, padding=0):
    """Scan sheet to find the next ID in sequence based on a prefix."""
    try:
        # Read the first 26 columns to scan headers and values
        result = sheets.values().get(spreadsheetId=sheet_id, range=f"'{tab_name}'!A:Z").execute()
        rows = result.get("values", [])
        if not rows or len(rows) <= 1:
            return f"{prefix}{start_num}" if padding == 0 else f"{prefix}{start_num:0{padding}d}"
            
        header = [h.strip().lower() for h in rows[0]]
        if col_name.lower() not in header:
            return f"{prefix}{start_num}" if padding == 0 else f"{prefix}{start_num:0{padding}d}"
            
        col_idx = header.index(col_name.lower())
        max_num = 0
        for row in rows[1:]:
            if len(row) > col_idx:
                val = row[col_idx].strip()
                if val.startswith(prefix):
                    num_str = val[len(prefix):]
                    if num_str.isdigit():
                        max_num = max(max_num, int(num_str))
                        
        if max_num == 0:
            next_num = start_num
        else:
            next_num = max_num + 1
            
        return f"{prefix}{next_num}" if padding == 0 else f"{prefix}{next_num:0{padding}d}"
    except Exception as e:
        # Fallback without printing credentials/sheet_id
        return f"{prefix}{start_num}" if padding == 0 else f"{prefix}{start_num:0{padding}d}"

def normalize_string(s: str) -> str:
    """Normalize string by removing all non-alphanumeric characters and converting to lowercase."""
    return re.sub(r'[^a-z0-9]', '', s.lower())

def resolve_item_row(item: str, rows: list, header: list):
    """Resolve an item name or ID to a row and index in the inventory sheet using exact and fuzzy matching."""
    if not rows or len(rows) <= 1:
        return None, None
        
    try:
        item_id_idx = header.index("item_id")
        item_name_idx = header.index("item_name")
    except ValueError:
        return None, None
        
    item_lower = item.strip().lower()
    item_clean = normalize_string(item)
    
    # 1. Exact match checks on ID or Name (case-insensitive, normalized)
    for idx, row in enumerate(rows[1:], start=1):
        if len(row) > max(item_id_idx, item_name_idx):
            row_id = row[item_id_idx].strip().lower()
            row_name = row[item_name_idx].strip().lower()
            if row_id == item_lower or row_name == item_lower:
                return row, idx
                
            # Exact clean match
            if item_clean == normalize_string(row_id) or item_clean == normalize_string(row_name):
                return row, idx
                
    # 2. Fuzzy match checks on name/id using rapidfuzz
    best_row = None
    best_row_idx = None
    best_score = 0.0
    
    for idx, row in enumerate(rows[1:], start=1):
        if len(row) > max(item_id_idx, item_name_idx):
            row_id = row[item_id_idx].strip()
            row_name = row[item_name_idx].strip()
            
            clean_id = normalize_string(row_id)
            clean_name = normalize_string(row_name)
            
            # Score against ID and Name using rapidfuzz
            score_id = max(fuzz.ratio(item_clean, clean_id), fuzz.partial_ratio(item_clean, clean_id))
            score_name = max(fuzz.ratio(item_clean, clean_name), fuzz.partial_ratio(item_clean, clean_name))
            score = max(score_id, score_name)
            
            if score > best_score:
                best_score = score
                best_row = row
                best_row_idx = idx
                
    # Threshold for fuzzy match (70% represents a very high quality match)
    if best_score >= 70.0:
        return best_row, best_row_idx
        
    return None, None

@mcp.tool()
def get_stock(item: str) -> str:
    """Get the current stock quantity of a given item.

    Args:
        item: The name or ID of the item to search for.
    """
    try:
        sheets, sheet_id = get_sheets_service()
        # Read Inventory tab
        result = sheets.values().get(spreadsheetId=sheet_id, range="'Inventory'!A:E").execute()
        rows = result.get("values", [])
        if not rows or len(rows) <= 1:
            return "Error: No items found in the inventory sheet."
            
        header = [h.strip().lower() for h in rows[0]]
        try:
            item_id_idx = header.index("item_id")
            item_name_idx = header.index("item_name")
            stock_qty_idx = header.index("stock_qty")
        except ValueError as e:
            return f"Error: Inventory sheet is missing required columns. Missing: {e}"
            
        found_row, _ = resolve_item_row(item, rows, header)
        if found_row is None:
            return f"Item '{item}' not found in inventory."
            
        return f"Item '{found_row[item_name_idx]}' ({found_row[item_id_idx]}) has {found_row[stock_qty_idx]} units in stock."
    except Exception as e:
        return f"Error connecting to sheet: {str(e)}"

@mcp.tool()
def get_price(item: str) -> str:
    """Get the price of a given item.

    Args:
        item: The name or ID of the item to search for.
    """
    try:
        sheets, sheet_id = get_sheets_service()
        # Read Inventory tab
        result = sheets.values().get(spreadsheetId=sheet_id, range="'Inventory'!A:E").execute()
        rows = result.get("values", [])
        if not rows or len(rows) <= 1:
            return "Error: No items found in the inventory sheet."
            
        header = [h.strip().lower() for h in rows[0]]
        try:
            item_id_idx = header.index("item_id")
            item_name_idx = header.index("item_name")
            price_inr_idx = header.index("price_inr")
        except ValueError as e:
            return f"Error: Inventory sheet is missing required columns. Missing: {e}"
            
        found_row, _ = resolve_item_row(item, rows, header)
        if found_row is None:
            return f"Item '{item}' not found in inventory."
            
        return f"Item '{found_row[item_name_idx]}' ({found_row[item_id_idx]}) costs Rs. {found_row[price_inr_idx]}."
    except Exception as e:
        return f"Error connecting to sheet: {str(e)}"

@mcp.tool()
def create_order(item: str, qty: int, customer: str) -> str:
    """Create a new order in the sheet. Decrements inventory stock and creates/resolves customer.

    Args:
        item: The name or ID of the item being ordered.
        qty: The quantity to order (must be positive).
        customer: The name of the customer placing the order.
    """
    # Guardrail: Quantity validation
    try:
        qty = int(qty)
    except (ValueError, TypeError):
        return "Error: Quantity must be a valid integer."
        
    if qty <= 0:
        return "Error: Quantity must be a positive integer."
        
    try:
        sheets, sheet_id = get_sheets_service()
        
        # 1. Resolve Item and Verify Stock
        result = sheets.values().get(spreadsheetId=sheet_id, range="'Inventory'!A:E").execute()
        inv_rows = result.get("values", [])
        if not inv_rows or len(inv_rows) <= 1:
            return "Error: No items found in the inventory sheet."
            
        inv_header = [h.strip().lower() for h in inv_rows[0]]
        try:
            item_id_idx = inv_header.index("item_id")
            item_name_idx = inv_header.index("item_name")
            stock_qty_idx = inv_header.index("stock_qty")
        except ValueError as e:
            return f"Error: Inventory sheet is missing required columns. Missing: {e}"
            
        found_inv_row, found_inv_row_idx = resolve_item_row(item, inv_rows, inv_header)
        if found_inv_row is None:
            return f"Error: Item '{item}' not found in inventory."
            
        item_id = found_inv_row[item_id_idx]
        item_name = found_inv_row[item_name_idx]
        
        # Check stock availability
        try:
            current_stock = int(found_inv_row[stock_qty_idx])
        except (ValueError, TypeError):
            return f"Error: Invalid stock value for item '{item_name}'."
            
        if current_stock < qty:
            return f"Error: Insufficient stock. Only {current_stock} available, but {qty} requested."
            
        # 2. Resolve or Create Customer
        cust_result = sheets.values().get(spreadsheetId=sheet_id, range="'Customers'!A:D").execute()
        cust_rows = cust_result.get("values", [])
        customer_id = None
        
        # Check if customer exists by name
        cust_name_lower = customer.strip().lower()
        if cust_rows and len(cust_rows) > 1:
            cust_header = [h.strip().lower() for h in cust_rows[0]]
            if "name" in cust_header and "customer_id" in cust_header:
                c_name_idx = cust_header.index("name")
                c_id_idx = cust_header.index("customer_id")
                for row in cust_rows[1:]:
                    if len(row) > max(c_name_idx, c_id_idx):
                        if row[c_name_idx].strip().lower() == cust_name_lower:
                            customer_id = row[c_id_idx].strip()
                            break
                            
        # Create customer if not found
        if customer_id is None:
            customer_id = get_next_id(sheets, sheet_id, "Customers", "customer_id", "CUST", start_num=1, padding=3)
            # Fetch Customers headers
            cust_header_result = sheets.values().get(spreadsheetId=sheet_id, range="'Customers'!A1:Z1").execute()
            cust_headers = [h.strip().lower() for h in cust_header_result.get("values", [[]])[0]]
            
            cust_field_mapping = {
                "customer_id": customer_id,
                "name": customer.strip(),
                "contact": "",
                "notes": ""
            }
            
            cust_row_data = [""] * len(cust_headers)
            for idx, h in enumerate(cust_headers):
                if h in cust_field_mapping:
                    cust_row_data[idx] = cust_field_mapping[h]
                    
            sheets.values().append(
                spreadsheetId=sheet_id,
                range="'Customers'!A:D",
                valueInputOption="RAW",
                body={"values": [cust_row_data]}
            ).execute()
            
        # 3. Generate Order ID and Write Order
        order_id = get_next_id(sheets, sheet_id, "Orders", "order_id", "ORD", start_num=1001, padding=0)
        
        # Fetch Orders headers
        order_header_result = sheets.values().get(spreadsheetId=sheet_id, range="'Orders'!A1:Z1").execute()
        order_headers = [h.strip().lower() for h in order_header_result.get("values", [[]])[0]]
        
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        order_field_mapping = {
            "order_id": order_id,
            "customer_id": customer_id,
            "item_id": item_id,
            "qty": str(qty),
            "status": "confirmed",
            "created_at": now_str
        }
        
        order_row_data = [""] * len(order_headers)
        for idx, h in enumerate(order_headers):
            if h in order_field_mapping:
                order_row_data[idx] = order_field_mapping[h]
                
        # Append order row
        sheets.values().append(
            spreadsheetId=sheet_id,
            range=f"'Orders'!A:{chr(65 + len(order_headers) - 1)}",
            valueInputOption="RAW",
            body={"values": [order_row_data]}
        ).execute()
        
        # 4. Decrement Stock in Inventory
        new_stock = current_stock - qty
        col_letter = chr(65 + stock_qty_idx)
        # found_inv_row_idx is 1-indexed relative to sheet rows (as scan started from row index 1 which is sheet row 2)
        sheet_row_num = found_inv_row_idx + 1 
        
        sheets.values().update(
            spreadsheetId=sheet_id,
            range=f"'Inventory'!{col_letter}{sheet_row_num}",
            valueInputOption="RAW",
            body={"values": [[str(new_stock)]]}
        ).execute()
        
        return f"Order {order_id} confirmed. Customer '{customer}' ({customer_id}) ordered {qty} units of '{item_name}' ({item_id}). Remaining stock: {new_stock}."
    except Exception as e:
        return f"Error creating order: {str(e)}"

@mcp.tool()
def log_escalation(reason: str, context: str) -> str:
    """Log an escalation event to the Escalations sheet tab.

    Args:
        reason: The reason for escalation (e.g., abusive language, human handoff request).
        context: Contextual description or conversation transcript snippets.
    """
    try:
        sheets, sheet_id = get_sheets_service()
        
        # Generate Escalation ID
        escalation_id = get_next_id(sheets, sheet_id, "Escalations", "escalation_id", "ESC", start_num=1, padding=3)
        
        # Fetch Escalations headers
        esc_header_result = sheets.values().get(spreadsheetId=sheet_id, range="'Escalations'!A1:Z1").execute()
        esc_headers = [h.strip().lower() for h in esc_header_result.get("values", [[]])[0]]
        
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        esc_field_mapping = {
            "escalation_id": escalation_id,
            "reason": reason,
            "context": context,
            "created_at": now_str
        }
        
        esc_row_data = [""] * len(esc_headers)
        for idx, h in enumerate(esc_headers):
            if h in esc_field_mapping:
                esc_row_data[idx] = esc_field_mapping[h]
                
        sheets.values().append(
            spreadsheetId=sheet_id,
            range=f"'Escalations'!A:{chr(65 + len(esc_headers) - 1)}",
            valueInputOption="RAW",
            body={"values": [esc_row_data]}
        ).execute()
        
        return f"Escalation logged successfully with ID: {escalation_id}."
    except Exception as e:
        return f"Error logging escalation: {str(e)}"

if __name__ == "__main__":
    # Start FastMCP server (default runs using stdio transport)
    mcp.run()
