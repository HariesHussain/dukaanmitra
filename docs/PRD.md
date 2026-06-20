# Product Requirements Document — DukaanMitra

## 1. Problem Statement
Small Indian businesses (kirana stores, salons, repair shops) handle most customer interaction over WhatsApp or phone calls, manually. This leads to missed messages, inconsistent answers about stock/pricing, and no structured order record. DukaanMitra automates the repetitive parts of this conversation while keeping a human in the loop for anything sensitive.

## 2. Target Users / Personas
- **Persona A — Shop Owner**: runs a kirana store/salon/repair shop, wants fewer missed customer messages and a reliable order log, without giving up control.
- **Persona B — Customer**: wants quick, accurate answers about stock, price, and order status without waiting for a reply.

## 3. Goals
- **Primary**: reduce missed or delayed customer responses
- **Secondary**: maintain a structured digital record of orders and inventory
- **Tertiary**: prevent the agent from overpromising (fake stock, fake price, fake delivery time)

## 4. Success Metrics (for the capstone demo)
- % of test queries correctly resolved without human escalation
- % of guardrail tests passed (agent never invents a price/stock number)
- Qualitative: response clarity and tone across sample transcripts

## 5. In Scope (MVP for capstone)
- Text chat interface (CLI or a simple web chat is fine)
- Checking stock and price from a Google Sheet
- Placing a simple order (item, quantity, customer name/contact)
- Escalating ambiguous, complex, or abusive queries to a "human" stub
- Guardrails against prompt injection and hallucinated information

## 6. Out of Scope (for now)
- Real payment processing
- Real WhatsApp Business API integration (can be mocked/simulated)
- Multi-language support beyond an English/Hindi sample
- Production-grade deployment or scaling

## 7. User Stories
- As a customer, I want to ask "do you have X in stock?" and get an accurate answer.
- As a customer, I want to place an order without calling the shop.
- As a shop owner, I want the agent to never promise something that isn't in stock.
- As a shop owner, I want to be looped in when a customer is upset or the request is unusual.

## 8. Assumptions & Constraints
- Inventory data lives in a Google Sheet (a stand-in for a real POS system)
- Single business per deployment for this MVP
- Judged on code quality and a demo video, not live customer traffic
