# Security & Guardrails — DukaanMitra

## Threat Model
| Threat | Risk | Mitigation |
|---|---|---|
| Prompt injection ("ignore your instructions...") | Agent leaks its system prompt or bypasses its own rules | Input pattern detection + a hardened system prompt + a refuse-and-redirect behavior |
| Hallucinated price/stock | Agent promises something untrue, costs the business money | Every numeric claim must come from an actual tool call result; the draft response is checked against the latest tool result before it's sent |
| Abusive/harassing customer input | Agent gets manipulated, or produces a bad response | Input classifier flags abuse → a polite fixed response + escalation, never an improvised reply |
| Customer data exposure | Phone numbers/names leaked in logs or shown to the wrong person | Contact fields are never echoed back in full; logs redact contact info |
| Over-scoped tool access | Agent could overwrite inventory arbitrarily | MCP server tools are narrow and validated (e.g. `create_order` can't set a negative quantity, can't modify price) |

## Implementation Notes (for code)
- `guardrails.py` runs as a pre-check on every incoming message and a post-check on every outgoing agent message
- **Pre-check**: regex/keyword matching plus a lightweight classifier for injection and abuse patterns
- **Post-check**: any number in the agent's draft response must match a number actually returned by a tool call that turn — otherwise the response is rejected and regenerated, or escalated
- All guardrail triggers are logged with a timestamp and reason, for use in the demo video

## What to Show in the Demo Video
- One clean happy-path order
- One blocked prompt-injection attempt
- One blocked "agent tries to promise stock it doesn't have" case (can be deliberately triggered for the demo)
