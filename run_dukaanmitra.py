import os
import sys
import asyncio
import logging
import warnings
from pathlib import Path
from dotenv import load_dotenv

# Suppress user warnings and framework logs
warnings.filterwarnings("ignore")
logging.disable(logging.INFO)

# Add project root to sys.path to allow importing agents and other components
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

# Load environment variables
load_dotenv(dotenv_path=PROJECT_ROOT / ".env")

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from agents.conversation_agent import conversation_agent
from agents.guardrails import pre_check_input, post_check_output
from mcp_server.sheet_mcp_server import log_escalation

async def main():
    print("==================================================")
    print("DukaanMitra Multi-Agent Chat Interface")
    print("Type 'exit' or 'quit' to end the conversation.")
    print("==================================================")
    
    # Verify Gemini API Key
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY is not set in your .env file.")
        print("Please configure your .env file with a valid Gemini API Key first.")
        return

    session_service = InMemorySessionService()
    runner = Runner(
        agent=conversation_agent,
        session_service=session_service,
        app_name="dukaanmitra_app",
        auto_create_session=True
    )
    
    session_id = "dukaanmitra_main_session"
    
    while True:
        try:
            user_input = input("\nCustomer > ")
            if user_input.strip().lower() in ["exit", "quit"]:
                print("Goodbye!")
                break
                
            if not user_input.strip():
                continue
                
            # 1. Run Input Guardrail (Pre-check)
            is_safe, refusal_type = pre_check_input(user_input)
            if not is_safe:
                if refusal_type == "injection":
                    print("Agent > I cannot perform that action. I am here to help you check stock, prices, and place orders.")
                elif refusal_type == "abuse":
                    # Automatically log escalation for abusive inputs
                    log_escalation(
                        reason="Abusive Input",
                        context=f"Customer said: '{user_input}'"
                    )
                    print("Agent > Your message has been logged for the shop owner.")
                continue
                
            # 2. Run Coordinator Agent and Capture Tool Outputs
            tool_outputs = []
            response_chunks = []
            
            async for event in runner.run_async(
                user_id="customer_user",
                session_id=session_id,
                new_message=types.UserContent(parts=[types.Part(text=user_input)])
            ):
                # Collect tool outputs from event stream
                if event.content and event.content.parts:
                    for part in event.content.parts:
                        if part.function_response:
                            res_str = str(part.function_response.response)
                            tool_outputs.append(res_str)
                
                # Collect response text chunks
                if event.content and getattr(event.content, "role", None) == "model" and event.content.parts:
                    for part in event.content.parts:
                        if part.text:
                            response_chunks.append(part.text)
                            
            response_text = "".join(response_chunks)
            
            # 3. Run Output Guardrail (Post-check)
            is_accurate = post_check_output(response_text, tool_outputs)
            if not is_accurate:
                # Log escalation for hallucinated numerical values
                log_escalation(
                    reason="Hallucination Guardrail Triggered",
                    context=f"Query: '{user_input}'\nDraft response: '{response_text}'\nTool outputs: {tool_outputs}"
                )
                print("Agent > I have logged your request. The shop owner will follow up and respond within a few hours.")
            else:
                # Output the clean response
                print(f"Agent > {response_text}")
                
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())
