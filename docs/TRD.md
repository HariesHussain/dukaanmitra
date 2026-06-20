# Technical Requirements Document — DukaanMitra

## 1. Tech Stack
- Language: Python 3.11+
- Dev environment: Google Antigravity (free, public preview) — used to build and run agents; show this in the demo video to cover the "Antigravity" concept
- Agent framework: Google Agent Development Kit (ADK) — free, open-source
- Data layer: Google Sheets, accessed via an MCP server — free standard quota
- LLM: `gemini-2.5-flash` via the Gemini API — stays on the free tier (~10 RPM / 250 req/day), which comfortably covers development and all 9 test cases. Avoid `gemini-2.5-pro` for this project — its free quota is much tighter (~5 RPM / 100 req/day) for no real benefit at this scale.
- Optional UI: simple CLI, or a lightweight web chat (Flask/Streamlit)

**Cost note**: Do not enable Google Cloud billing on the project tied to your Gemini API key — doing so removes the free tier entirely, even for calls that would've been free. Keep this as a separate, billing-disabled project.

## 2. System Components

### 2.1 Conversation Agent
- Entry point for all customer messages
- Classifies intent: `stock_check` / `order` / `complaint` / `abuse` / `other`
- Delegates to the Inventory/Order Agent or the Escalation Agent

### 2.2 Inventory/Order Agent
- Calls MCP server tools: `get_stock(item)`, `get_price(item)`, `create_order(item, qty, customer)`
- Never states a price or stock number that didn't come from an actual tool call

### 2.3 Escalation Agent
- Triggered by: abusive input, low-confidence intent, refund/complaint requests outside skill scope
- Produces a structured handoff note for the (simulated) human owner

### 2.4 Guardrails Layer
- Runs on every agent input and output — see `SECURITY.md`

## 3. MCP Server
- Wraps a Google Sheet with 3 tabs: Inventory, Orders, Customers
- Exposes tools: `get_stock`, `get_price`, `create_order`, `log_escalation`
- Auth: Google service account, credentials passed via environment variable, never hardcoded

## 4. Data Flow
1. Customer message → Conversation Agent
2. Conversation Agent → intent classification
3. If stock/order related → Inventory/Order Agent → MCP Server → Sheet
4. If ambiguous/abusive → Escalation Agent → log + handoff note
5. Response returned to the customer

## 5. Non-Functional Requirements
- **Latency**: response should feel near-real-time for a chat demo (under ~5s typical)
- **Reliability**: tool-call failures must produce a graceful fallback message, never a crash
- **Security**: see `SECURITY.md`
- **Observability**: log every tool call and guardrail trigger to a local log file, for use in the demo video

## 6. Environment & Setup
- `.env` variables: `GOOGLE_SHEETS_CREDS`, `SHEET_ID`, `GEMINI_API_KEY`
- `requirements.txt` with pinned versions
- README setup steps should let a judge run the project locally in under 10 minutes
- **Never commit API keys, credentials, or `.env` files**
