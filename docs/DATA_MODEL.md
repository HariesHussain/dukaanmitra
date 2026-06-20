# Data Model — DukaanMitra

Backed by a Google Sheet with 3 tabs, accessed only through the MCP server — agents never touch the Sheet directly.

## Tab: Inventory
| Column | Type | Notes |
|---|---|---|
| item_id | string | unique |
| item_name | string | |
| price_inr | number | |
| stock_qty | integer | source of truth for stock answers |
| category | string | optional |

## Tab: Orders
| Column | Type | Notes |
|---|---|---|
| order_id | string | auto-generated |
| customer_id | string | FK → Customers |
| item_id | string | FK → Inventory |
| qty | integer | |
| status | string | pending / confirmed / delivered / cancelled |
| created_at | datetime | |

## Tab: Customers
| Column | Type | Notes |
|---|---|---|
| customer_id | string | |
| name | string | |
| contact | string | phone/WhatsApp — treat as sensitive, see SECURITY.md |
| notes | string | optional, e.g. delivery address |

## MCP Tool ↔ Sheet Mapping
| MCP Tool | Reads/Writes | Sheet/Tab |
|---|---|---|
| `get_stock(item)` | read | Inventory |
| `get_price(item)` | read | Inventory |
| `create_order(item, qty, customer)` | write | Orders, Customers |
| `log_escalation(reason, context)` | write | Escalations (separate tab, optional) |
