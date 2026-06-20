# DukaanMitra — AI Agent for Small Indian Businesses

**Kaggle Capstone Track:** Agents for Business

## Problem
Small Indian businesses (kirana stores, salons, repair shops) lose orders and customers because:
- The owner can't reply to WhatsApp/calls fast enough during busy hours
- There's no easy way to check live stock before promising a customer something
- Repetitive questions (timings, prices, availability) eat staff time
- There's no structured order/inventory record — it's all in the owner's head or a notebook

## Solution
DukaanMitra is a multi-agent AI system that handles customer chat, checks real inventory, takes orders, and only escalates to the human owner when needed — while staying inside guardrails so it never invents prices or stock that doesn't exist.

## Architecture (one line)
Customer → **Conversation Agent** → delegates to → **Inventory/Order Agent** ↔ **MCP Server** ↔ Google Sheet (live inventory & orders), with a **Human Handoff (Escalation) Agent** for anything outside the agent's authority.

Full diagrams in `docs/SYSTEM_DESIGN.md`.

## Course concepts demonstrated
| Concept | Where it's shown |
|---|---|
| Multi-agent system (ADK) | `/agents` — Conversation, Inventory/Order, Escalation agents |
| MCP Server | `/mcp_server` — wraps a Google Sheet as a live data source |
| Security features | `/agents/guardrails.py` + `docs/SECURITY.md` |
| Agent skills | `/skills` — refund, delay, and FAQ skill definitions |
| Antigravity | Used as the dev environment to build/run this project — show in the demo video, not in code |

## Development Environment & Free-Tier Stack
This project is built inside **Google Antigravity** (free for individuals in public preview). The whole stack stays on free tiers:

| Component | Free tier | Notes |
|---|---|---|
| Gemini API | `gemini-2.5-flash` | ~10 RPM / 250 requests-per-day free — comfortably covers dev + the 9-case test plan |
| Google ADK | Free, open-source | No cost |
| Google Sheets API | Standard free quota | Fine at this scale |
| Antigravity | Free for individuals | Do **not** enable Cloud billing on the same project — it removes the Gemini free tier entirely |
| MCP server | Local only | No hosting needed |
| Deployment | Optional per competition rules | Demo runs locally — zero infra cost |

## Repo structure
```
dukaanmitra/
├── agents/
│   ├── conversation_agent.py
│   ├── inventory_order_agent.py
│   ├── escalation_agent.py
│   └── guardrails.py
├── mcp_server/
│   └── sheet_mcp_server.py
├── skills/
│   ├── refund_skill.md
│   ├── delay_skill.md
│   └── faq_skill.md
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── SYSTEM_DESIGN.md
│   ├── USER_FLOWS.md
│   ├── DATA_MODEL.md
│   ├── SECURITY.md
│   ├── AGENT_SKILLS.md
│   └── TEST_PLAN.md
└── README.md
```

## Setup
1. `pip install google-adk` (or the relevant ADK package name)
2. Create a Google Sheet using the schema in `docs/DATA_MODEL.md`
3. Set up a Google service account, add credentials via environment variables (never commit them)
4. `python mcp_server/sheet_mcp_server.py`
5. `python agents/conversation_agent.py` to start the chat agent

## Demo
- 5-minute video walkthrough: *[add link]*
- Public link or GitHub repo: *this repo*

## Submission checklist (Kaggle capstone)
- [ ] Kaggle Writeup (≤2,500 words, track selected)
- [ ] Cover image + video in Media Gallery (video ≤5 min, on YouTube)
- [ ] Public project link or GitHub repo with setup instructions
- [ ] README.md with problem, solution, architecture, setup, diagrams
- [ ] No API keys or secrets committed anywhere in the repo
