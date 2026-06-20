# System Design — DukaanMitra

## High-Level Architecture
```mermaid
flowchart LR
    C[Customer] -->|message| CA[Conversation Agent]
    CA -->|stock/order intent| IOA[Inventory/Order Agent]
    CA -->|ambiguous/abusive| EA[Escalation Agent]
    IOA <--> MCP[MCP Server]
    MCP <--> SHEET[(Google Sheet:\nInventory / Orders / Customers)]
    EA --> LOG[(Escalation Log)]
    CA --> G[Guardrails Layer]
    IOA --> G
```

## Agent Responsibilities
| Agent | Responsibility | Tools used |
|---|---|---|
| Conversation Agent | Intent routing, top-level reply | none (delegates to others) |
| Inventory/Order Agent | Real stock/price/order actions | MCP tools |
| Escalation Agent | Handle edge cases, log handoffs | `log_escalation` |

## Key Sequence: Customer Places an Order
```mermaid
sequenceDiagram
    participant Cust as Customer
    participant CA as Conversation Agent
    participant IOA as Inventory/Order Agent
    participant MCP as MCP Server
    Cust->>CA: "2 packets of Maggi, deliver today"
    CA->>IOA: intent=order, item=Maggi, qty=2
    IOA->>MCP: get_stock("Maggi")
    MCP-->>IOA: stock=15
    IOA->>MCP: create_order("Maggi", 2, customer_id)
    MCP-->>IOA: order_id=1042
    IOA-->>CA: confirmation + order_id
    CA-->>Cust: "Order #1042 confirmed, 2x Maggi"
```

## Guardrails Placement
Guardrails wrap both the Conversation Agent's input (sanitize/detect injection attempts) and the Inventory/Order Agent's output (verify any number against an actual tool result before it's spoken to the customer). Full detail in `SECURITY.md`.

## Escalation Trigger Logic
An interaction is escalated to the human owner when any of the following is true:
- The intent classifier's confidence score is below threshold
- Abusive or harassing language is detected
- The customer explicitly asks for a refund or to speak to a person
