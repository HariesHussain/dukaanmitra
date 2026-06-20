import os
import asyncio
import sys
import logging
import warnings
from pathlib import Path
from dotenv import load_dotenv

# Suppress user/experimental warnings from dependencies
warnings.filterwarnings("ignore")

# Disable INFO logs globally to keep the terminal output clean
logging.disable(logging.INFO)

# Add project root to sys.path to allow importing mcp_server and agents
PROJECT_ROOT = Path("c:/Users/Admin/Documents/dukaanmitra")
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

# Load .env
load_dotenv(dotenv_path=PROJECT_ROOT / ".env")

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.inventory_order_agent import inventory_order_agent

async def cli_loop():
    print("==================================================")
    print("DukaanMitra Inventory/Order Agent CLI Test")
    print("Type 'exit' or 'quit' to end the conversation.")
    print("==================================================")
    
    # Check for GEMINI_API_KEY
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY is not set in your .env file.")
        print("Please configure your .env file with a valid Gemini API Key first.")
        return

    session_service = InMemorySessionService()
    runner = Runner(
        agent=inventory_order_agent,
        session_service=session_service,
        app_name="dukaanmitra_app",
        auto_create_session=True
    )
    
    session_id = "cli_test_session"
    
    while True:
        try:
            user_input = input("\nCustomer > ")
            if user_input.strip().lower() in ["exit", "quit"]:
                print("Ending CLI session. Goodbye!")
                break
                
            if not user_input.strip():
                continue
                
            print("Agent > ", end="", flush=True)
            
            # Send message to agent
            async for event in runner.run_async(
                user_id="cli_user",
                session_id=session_id,
                new_message=types.UserContent(parts=[types.Part(text=user_input)])
            ):
                if event.content and getattr(event.content, "role", None) == "model" and event.content.parts:
                    for part in event.content.parts:
                        if part.text:
                            print(part.text, end="", flush=True)
            print()
            
        except KeyboardInterrupt:
            print("\nEnding CLI session. Goodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(cli_loop())
