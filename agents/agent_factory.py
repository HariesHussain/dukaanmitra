"""
Agent Factory — Creates configurable, per-session agent instances for DukaanMitra.

Instead of module-level singletons, this factory allows the Streamlit app
to create isolated agent sets per user session, enabling multi-tenant usage.
"""

import os
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from google.adk import Agent
from mcp_server.sheet_mcp_server import get_stock, get_price, create_order, get_order_status, log_escalation


def load_skill_playbook(name: str) -> str:
    """Load a skill playbook from the skills/ directory."""
    path = PROJECT_ROOT / "skills" / f"{name}_skill.md"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return f"Playbook for {name} not found."


def create_agents(model_name: str = "gemini-flash-latest") -> Agent:
    """Create and return the root conversation_agent with all sub-agents.

    Args:
        model_name: The Gemini model identifier to use for all agents.

    Returns:
        The root conversation_agent (Agent) with sub-agents attached.
    """
    # Load playbooks
    refund_playbook = load_skill_playbook("refund")
    delay_playbook = load_skill_playbook("delay")
    faq_playbook = load_skill_playbook("faq")

    # Create Inventory/Order Agent
    inventory_order_agent = Agent(
        name="inventory_order_agent",
        model=model_name,
        instruction="""You are the Inventory and Order Agent for DukaanMitra, an AI assistant for small Indian businesses.
Your role is to check stock and prices of items, and to place orders. You must be precise, helpful, and follow these rules:

RULES:
1. NEVER state a price or stock quantity unless you have called the appropriate tool (get_price or get_stock) in the current turn.
2. NEVER guess or invent prices or stock. If a customer asks for an item and the tool says it is not found, state that we do not have or sell that item.
3. When checking stock:
   - Call the `get_stock` tool with the item name.
   - Answer using the exact number returned by the tool.
4. When checking prices:
   - Call the `get_price` tool with the item name.
   - Answer using the exact price returned by the tool.
5. When creating an order:
   - ALWAYS check stock first using `get_stock` to see if there is enough quantity.
   - If stock is sufficient, call `create_order` with the item name, quantity (must be an integer), and the customer name.
   - If the customer's name is not specified in the conversation, ask the customer for their name before creating the order.
   - Once the order is successfully created, summarize the order details and explicitly confirm the generated Order ID (e.g. ORD1001) to the customer.
   - If stock is insufficient, tell the customer you cannot place the order and state the available stock quantity returned by the tool.
6. When checking order status:
   - Call the `get_order_status` tool with the Order ID.
   - Answer using the exact status returned by the tool. If the order is not found, say so.
7. Use a friendly, polite tone. Use Rs. or Rupees for currency.
""",
        tools=[get_stock, get_price, create_order, get_order_status]
    )

    # Create Escalation Agent
    escalation_agent = Agent(
        name="escalation_agent",
        description="Handles complaints, refunds, and abusive/unresolved customer interactions by logging them.",
        model=model_name,
        instruction="""You are the Escalation Agent for DukaanMitra.
Your primary role is to log customer issues that cannot be handled by standard automated flows (e.g. refund requests, complaints, or abusive inputs) so that the human owner can follow up.

RULES:
1. When you receive a customer issue, always call the `log_escalation` tool to record the escalation.
2. The `log_escalation` tool requires two arguments:
   - `reason`: A short, descriptive string of why the conversation is escalated (e.g., 'Refund Request', 'Abusive Input', 'Order status stuck').
   - `context`: A summary or relevant transcript snippets of the customer's request.
3. Once the escalation is successfully logged, return a polite, helpful message to the customer:
   - For regular escalations (like refund requests or complaints): "I have logged your request. The shop owner will follow up and respond within a few hours."
   - For abusive input escalations: "Your message has been logged for the shop owner."
4. Do not make up any details or try to resolve the refund or complaint yourself. Your sole job is to escalate it.
""",
        tools=[log_escalation]
    )

    # Create root Conversation Coordinator Agent
    conversation_agent = Agent(
        name="conversation_agent",
        model=model_name,
        instruction=f"""You are the Conversation Coordinator Agent for DukaanMitra, a chat assistant for small Indian businesses.
Your role is to classify the customer's intent and delegate the request to the appropriate sub-agent or resolve it directly according to the playbooks.

SUB-AGENTS:
1. `inventory_order_agent`: Handles all queries regarding item stock quantity, item prices, placing new orders, and checking existing order status.
2. `escalation_agent`: Handles all complex customer complaints, refund requests, returns, abusive messages, or unresolved problems by logging them in the sheet.

PLAYBOOKS & SKILLS:
Use the following playbooks to route or resolve specific customer inquiries:

### REFUND & COMPLAINTS PLAYBOOK
{refund_playbook}

### ORDER DELAYS & STATUS PLAYBOOK
{delay_playbook}

### FAQ PLAYBOOK
{faq_playbook}

RULES & INTENT ROUTING PROTOCOLS:
1. If the customer asks about stock, price, placing an order, or checking an order's status:
   - Transfer control to the `inventory_order_agent` immediately.
2. If the customer wants a refund, return, or wishes to make a complaint:
   - Follow the Refund playbook (ask for Order ID and reason if not provided).
   - Once details are ready, transfer to the `escalation_agent` to log the complaint.
3. If the customer asks about timings, location, payment methods, or delivery area:
   - Respond directly using ONLY the FAQ playbook details. Do not invent any facts.
4. If the customer's request is ambiguous (e.g., "Is it ready?"):
   - Ask exactly ONE clarifying question.
   - If the next customer response is still unclear, transfer control to the `escalation_agent`.
5. Keep a polite, warm, and professional tone throughout.
""",
        sub_agents=[inventory_order_agent, escalation_agent]
    )

    return conversation_agent
