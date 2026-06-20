"""
StreamlitAgentRunner — Wraps the ADK Runner for Streamlit's execution model.

Handles:
- Dynamic env var injection for multi-tenant API keys / Sheet IDs
- Agent creation via factory
- Pre/post guardrails
- Structured response objects for the UI
"""

import os
import sys
import json
import asyncio
import logging
import warnings
import tempfile
from pathlib import Path

# Suppress noisy logs
warnings.filterwarnings("ignore")
logging.disable(logging.INFO)

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from agents.agent_factory import create_agents
from agents.guardrails import pre_check_input, post_check_output
from mcp_server.sheet_mcp_server import log_escalation


class StreamlitAgentRunner:
    """Manages an ADK agent session for a single Streamlit user."""

    def __init__(self, api_key: str, sheet_id: str, creds_json: dict | None = None, creds_file_path: str | None = None):
        """Initialize the runner with user-provided config.

        Args:
            api_key: Gemini API key.
            sheet_id: Google Sheet ID containing inventory data.
            creds_json: Parsed JSON content of service account credentials (uploaded by user).
            creds_file_path: Path to existing service account credentials file.
        """
        # Set environment variables dynamically for this session
        os.environ["GEMINI_API_KEY"] = api_key
        os.environ["SHEET_ID"] = sheet_id

        # Handle credentials
        if creds_json:
            # Write uploaded JSON to a temporary file
            self._temp_creds_file = tempfile.NamedTemporaryFile(
                mode='w', suffix='.json', delete=False, dir=tempfile.gettempdir()
            )
            json.dump(creds_json, self._temp_creds_file)
            self._temp_creds_file.close()
            os.environ["GOOGLE_SHEETS_CREDS"] = self._temp_creds_file.name
        elif creds_file_path:
            os.environ["GOOGLE_SHEETS_CREDS"] = creds_file_path
        # else: rely on existing .env

        # Load .env as fallback for any unset vars
        load_dotenv(dotenv_path=PROJECT_ROOT / ".env", override=False)

        # Create agents and runner
        self.root_agent = create_agents(model_name="gemini-flash-latest")
        self.session_service = InMemorySessionService()
        self.runner = Runner(
            agent=self.root_agent,
            session_service=self.session_service,
            app_name="dukaanmitra_app",
            auto_create_session=True
        )
        self.session_id = "streamlit_session"

    async def send_message_async(self, user_input: str) -> dict:
        """Process a user message through guardrails and the agent pipeline.

        Returns:
            dict with keys:
                - response_text: str — The agent's response
                - tool_activities: list[dict] — Tool calls made [{name, input, output}]
                - guardrail_status: str — "safe", "blocked_injection", "blocked_abuse", "hallucination_caught"
                - blocked: bool — Whether the message was blocked by guardrails
        """
        result = {
            "response_text": "",
            "tool_activities": [],
            "guardrail_status": "safe",
            "blocked": False
        }

        # 1. Pre-check guardrails
        is_safe, refusal_type = pre_check_input(user_input)
        if not is_safe:
            if refusal_type == "injection":
                result["response_text"] = "🛡️ I cannot perform that action. I am here to help you check stock, prices, and place orders."
                result["guardrail_status"] = "blocked_injection"
                result["blocked"] = True
            elif refusal_type == "abuse":
                try:
                    log_escalation(
                        reason="Abusive Input",
                        context=f"Customer said: '{user_input}'"
                    )
                except Exception:
                    pass  # Don't crash if escalation logging fails
                result["response_text"] = "🛡️ Your message has been logged for the shop owner."
                result["guardrail_status"] = "blocked_abuse"
                result["blocked"] = True
            return result

        # 2. Run agent pipeline
        tool_outputs = []
        response_chunks = []

        try:
            async for event in self.runner.run_async(
                user_id="customer_user",
                session_id=self.session_id,
                new_message=types.UserContent(parts=[types.Part(text=user_input)])
            ):
                if event.content and event.content.parts:
                    for part in event.content.parts:
                        # Capture tool call info
                        if part.function_call:
                            activity = {
                                "name": part.function_call.name,
                                "input": str(part.function_call.args) if part.function_call.args else "",
                                "output": ""  # Will be filled by function_response
                            }
                            result["tool_activities"].append(activity)

                        # Capture tool responses
                        if part.function_response:
                            res_str = str(part.function_response.response)
                            tool_outputs.append(res_str)
                            # Match response to the last tool activity without an output
                            for activity in result["tool_activities"]:
                                if not activity["output"]:
                                    activity["output"] = res_str
                                    break

                # Capture model text
                if event.content and getattr(event.content, "role", None) == "model" and event.content.parts:
                    for part in event.content.parts:
                        if part.text:
                            response_chunks.append(part.text)

            response_text = "".join(response_chunks)

            # 3. Post-check guardrails
            is_accurate = post_check_output(response_text, tool_outputs)
            if not is_accurate:
                try:
                    log_escalation(
                        reason="Hallucination Guardrail Triggered",
                        context=f"Query: '{user_input}'\nDraft response: '{response_text}'\nTool outputs: {tool_outputs}"
                    )
                except Exception:
                    pass
                result["response_text"] = "I have logged your request. The shop owner will follow up and respond within a few hours."
                result["guardrail_status"] = "hallucination_caught"
            else:
                result["response_text"] = response_text
                result["guardrail_status"] = "safe"

        except Exception as e:
            error_msg = str(e)
            if "RESOURCE_EXHAUSTED" in error_msg or "429" in error_msg:
                result["response_text"] = "⏳ API rate limit reached. Please wait a moment and try again."
            elif "503" in error_msg or "UNAVAILABLE" in error_msg:
                result["response_text"] = "⏳ The AI service is temporarily busy. Please try again in a few seconds."
            else:
                result["response_text"] = f"An error occurred: {error_msg}"
            result["guardrail_status"] = "error"

        return result

    def send_message(self, user_input: str) -> dict:
        """Synchronous wrapper around send_message_async for Streamlit."""
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # We're inside an existing event loop (Streamlit's)
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    future = pool.submit(asyncio.run, self.send_message_async(user_input))
                    return future.result(timeout=120)
            else:
                return loop.run_until_complete(self.send_message_async(user_input))
        except RuntimeError:
            return asyncio.run(self.send_message_async(user_input))
