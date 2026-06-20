# Agent Skills — DukaanMitra

Skills give the agent structured, reusable know-how for specific situations, kept separate from the core routing logic — matching the course's "agent skills" pattern of giving agents domain playbooks instead of hardcoding everything into one giant prompt.

## Skill: `refund_skill.md`
- **When to use**: customer mentions "refund", "wrong order", "damaged item"
- **Behavior**: gather order_id + reason → log a structured complaint → tell the customer it's escalated, set an expectation (e.g. "the shop owner will respond within a few hours")
- **Does NOT**: approve or process a refund itself — that's outside the agent's authority

## Skill: `delay_skill.md`
- **When to use**: customer asks "where is my order" / "why is it late"
- **Behavior**: look up the order's status field via the order data → give an honest status update → if the status is stuck or unclear, escalate rather than guess a delivery time

## Skill: `faq_skill.md`
- **When to use**: shop timings, location, payment methods, delivery area
- **Behavior**: answer from a small static FAQ config (not invented), keeping a friendly, on-brand tone for the shop

## How Skills Are Wired In
Each skill is a markdown file with trigger conditions and behavior rules, loaded by the Conversation Agent at startup and matched against the classified intent. This keeps domain knowledge editable by a non-technical shop owner without touching the agent's core code.
