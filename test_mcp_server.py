import sys
from mcp_server.sheet_mcp_server import get_stock, get_price, create_order, log_escalation

def run_tests():
    print("==================================================")
    print("STARTING GOOGLE SHEETS MCP SERVER TOOLS TEST")
    print("==================================================")

    # 1. Test get_stock (Item present)
    print("\n[TEST 1] Checking stock for 'Parle-G':")
    stock_res = get_stock("Parle-G")
    print(f"Result: {stock_res}")

    # 2. Test get_stock (Item missing)
    print("\n[TEST 2] Checking stock for non-existent item 'saffron':")
    stock_missing_res = get_stock("saffron")
    print(f"Result: {stock_missing_res}")

    # 3. Test get_price (Item present)
    print("\n[TEST 3] Checking price for 'Parle-G':")
    price_res = get_price("Parle-G")
    print(f"Result: {price_res}")

    # 4. Test create_order (Valid order)
    # This will decrement stock, resolve customer, and append order
    print("\n[TEST 4] Creating a valid order: 2 packets of 'Parle-G' for customer 'Ramesh Kumar':")
    order_res = create_order("Parle-G", 2, "Ramesh Kumar")
    print(f"Result: {order_res}")

    # 5. Test get_stock again (Verify stock decremented)
    print("\n[TEST 5] Checking stock for 'Parle-G' again (should be decremented by 2):")
    stock_after_res = get_stock("Parle-G")
    print(f"Result: {stock_after_res}")

    # 6. Test create_order (Insufficient stock)
    # This should fail and not change stock or create order
    print("\n[TEST 6] Trying to order more than available (100 units of 'Parle-G'):")
    over_order_res = create_order("Parle-G", 100, "Ramesh Kumar")
    print(f"Result: {over_order_res}")

    # 7. Test log_escalation
    print("\n[TEST 7] Logging an escalation:")
    escalation_res = log_escalation(
        reason="Abusive Language",
        context="Customer was using profanity when asking about refunds."
    )
    print(f"Result: {escalation_res}")

    print("\n==================================================")
    print("TEST SUITE COMPLETED")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
