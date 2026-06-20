import os
import sys
from pathlib import Path

# Add project root to sys.path to allow importing agents and other components
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

# Load playbooks from markdown files
def load_skill_playbook(name: str) -> str:
    path = PROJECT_ROOT / "skills" / f"{name}_skill.md"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return f"Playbook for {name} not found."

refund_playbook = load_skill_playbook("refund")
delay_playbook = load_skill_playbook("delay")
faq_playbook = load_skill_playbook("faq")

from google.adk import Agent
from agents.inventory_order_agent import inventory_order_agent
from agents.escalation_agent import escalation_agent

# Define the root Coordinator Agent
conversation_agent = Agent(
    name="conversation_agent",
    model="gemini-flash-latest",
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
