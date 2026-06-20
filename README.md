# 🏪 DukaanMitra — AI-Powered Shop Assistant for Small Indian Businesses

**Kaggle Capstone Track:** Agents for Business

> *Empowering kirana stores with AI — zero cost, zero coding required.*

---

## 🎯 Problem

Small Indian businesses (kirana stores, salons, repair shops) lose orders and customers because:
- The owner can't reply to WhatsApp/calls fast enough during busy hours
- There's no easy way to check live stock before promising a customer something
- Repetitive questions (timings, prices, availability) eat staff time
- There's no structured order/inventory record — it's all in the owner's head or a notebook

## 💡 Solution

DukaanMitra is a **multi-agent AI system** that handles customer chat, checks real inventory, takes orders, and only escalates to the human owner when needed — while staying inside guardrails so it **never invents prices or stock that doesn't exist**.

**Open-source, bring-your-own-API-key model** — any shop owner can use it for free.

---

## 🏗️ Architecture

```
Customer Message
      │
┌─────▼──────┐
│ Pre-Check   │ ← Prompt Injection & Abuse Filter
│ Guardrail   │
└─────┬──────┘
      │
┌─────▼──────────────┐
│ Conversation Agent  │ ← Intent Classification & Routing
│   (Coordinator)     │
└──┬──────────────┬──┘
   │              │
┌──▼──────┐ ┌────▼────────┐
│Inventory│ │ Escalation  │
│& Order  │ │   Agent     │
│ Agent   │ └────┬────────┘
└──┬──────┘      │
   │             │
┌──▼─────────────▼──┐
│   Google Sheets    │ ← Live Inventory, Orders, Customers, Escalations
│   (MCP Server)     │
└────────────────────┘
      │
┌─────▼──────┐
│ Post-Check  │ ← Anti-Hallucination Number Verification
│ Guardrail   │
└─────┬──────┘
      │
Customer Response (Verified)
```

Full diagrams in `docs/SYSTEM_DESIGN.md`.

---

## 📚 Course Concepts Demonstrated

| Concept | Where it's shown |
|---|---|
| Multi-agent system (ADK) | `/agents` — Conversation, Inventory/Order, Escalation agents |
| MCP Server | `/mcp_server` — wraps a Google Sheet as a live data source with 5 tools |
| Security features | `/agents/guardrails.py` — pre-check (injection/abuse) + post-check (hallucination) |
| Agent skills | `/skills` — refund, delay, and FAQ skill playbooks |
| Deployability | Streamlit Cloud deployment with zero-cost infrastructure |
| Antigravity | Used as the dev environment — shown in the demo video |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- A Google Cloud service account with Sheets API access
- A Gemini API key (free at [ai.google.dev](https://ai.google.dev))

### Installation

```bash
git clone https://github.com/your-repo/dukaanmitra.git
cd dukaanmitra
pip install -r requirements.txt
```

### Option A: Web UI (Recommended)

```bash
streamlit run app.py
```

1. Open the browser at `http://localhost:8501`
2. Toggle **Demo Mode** in the sidebar (or enter your own credentials)
3. Click **Connect** and start chatting!

### Option B: CLI Mode

```bash
# Create a .env file with your credentials
echo "GEMINI_API_KEY=your_key_here" > .env
echo "SHEET_ID=your_sheet_id" >> .env
echo "GOOGLE_SHEETS_CREDS=path/to/credentials.json" >> .env

# Run the CLI
python run_dukaanmitra.py
```

---

## 📁 Project Structure

```
dukaanmitra/
├── app.py                        # 🌐 Streamlit Web UI
├── run_dukaanmitra.py            # 💻 CLI Interface
├── requirements.txt              # 📦 Dependencies
├── agents/
│   ├── conversation_agent.py     # 🤖 Root coordinator agent
│   ├── inventory_order_agent.py  # 📦 Stock/price/order agent
│   ├── escalation_agent.py       # 🚨 Complaint/escalation agent
│   ├── guardrails.py             # 🛡️ Safety guardrails
│   └── agent_factory.py          # 🏭 Configurable agent factory
├── mcp_server/
│   └── sheet_mcp_server.py       # 📊 Google Sheets MCP tools
├── utils/
│   └── streamlit_runner.py       # 🔌 Streamlit ↔ ADK bridge
├── skills/
│   ├── refund_skill.md           # 💳 Refund playbook
│   ├── delay_skill.md            # ⏰ Order delay playbook
│   └── faq_skill.md              # ❓ Shop FAQ playbook
├── static/
│   └── styles.css                # 🎨 Premium UI styles
├── .streamlit/
│   └── config.toml               # 🎨 Theme config
└── docs/
    ├── PRD.md, TRD.md, SYSTEM_DESIGN.md
    ├── USER_FLOWS.md, DATA_MODEL.md
    ├── SECURITY.md, AGENT_SKILLS.md
    └── TEST_PLAN.md
```

---

## 🛡️ Safety & Security

DukaanMitra implements a **two-layer guardrail system**:

### Pre-Check (Input Guardrail)
- **Prompt Injection Detection**: Regex patterns catch "ignore instructions", "system prompt", etc.
- **Abusive Language Filter**: Blocks profanity and logs to Escalations sheet

### Post-Check (Output Guardrail)
- **Hallucination Prevention**: Extracts all numbers from the agent's response and verifies each one exists in the tool outputs from that turn
- **Automatic Escalation**: If a hallucinated number is detected, the response is suppressed and the query is escalated to the shop owner

---

## 💻 Development Environment & Free-Tier Stack

| Component | Free tier | Notes |
|---|---|---|
| Gemini API | `gemini-flash-latest` | Free tier with rate limits |
| Google ADK | Free, open-source | No cost |
| Google Sheets API | Standard free quota | Fine at this scale |
| Streamlit Cloud | Free for public apps | Sleeps after inactivity, wakes in ~30s |
| Antigravity | Free for individuals | Dev environment |

---

## 📝 Kaggle Submission Checklist

- [x] Multi-agent system with Google ADK
- [x] MCP Server wrapping Google Sheets
- [x] Security guardrails (pre + post check)
- [x] Agent skills (3 playbooks)
- [x] Deployable Streamlit web interface
- [x] Open-source, zero-cost stack
- [ ] Kaggle Writeup (≤2,500 words)
- [ ] Demo video (≤5 min, on YouTube)
- [ ] Public GitHub repo with setup instructions

---

## 📜 License

Open-source. Built for the Kaggle AI Agents Intensive Vibe Coding Capstone 2026.
