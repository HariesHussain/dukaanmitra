# Skill Playbook: Order Delays & Status Tracking

This playbook outlines how to check order status and handle delay questions.

## Trigger Phrase Keywords
- where is my order
- why is it late
- order status
- check status
- is it ready

## Rules & Protocol
1. **Get Order ID**: Ask the customer for their **Order ID** if they haven't provided it.
2. **Retrieve Status**:
   - Check the order status using the `get_order_status` tool.
   - If the status is returned (e.g. `pending`, `confirmed`, `delivered`, `cancelled`), report the status exactly to the customer.
3. **Escalate Unclear Status**: If the status is not found, seems stuck, or if the customer is upset about the delay, transfer to the Escalation Agent to log the issue. Do **not** invent a delivery estimate.
