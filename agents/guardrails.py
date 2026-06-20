import os
import re
import logging
from pathlib import Path

# Setup guardrails logging directory and logger
PROJECT_ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = PROJECT_ROOT / "test_logs"
os.makedirs(str(LOG_DIR), exist_ok=True)

# Custom logger for guardrails
guardrail_logger = logging.getLogger("guardrails")
guardrail_logger.setLevel(logging.INFO)

# File handler
log_file = LOG_DIR / "guardrails.log"
fh = logging.FileHandler(str(log_file), encoding="utf-8")
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
fh.setFormatter(formatter)
guardrail_logger.addHandler(fh)

def log_trigger(reason: str, stage: str, details: str):
    """Log guardrail trigger to test_logs/guardrails.log."""
    guardrail_logger.info(f"TRIGGERED - Stage: {stage} - Reason: {reason} - Details: {details}")

def pre_check_input(text: str) -> tuple[bool, str]:
    """Check incoming user message for prompt injection or abusive language.
    
    Returns:
        (is_safe, refusal_reason)
    """
    if not text:
        return True, ""
        
    # 1. Prompt Injection Detection
    injection_patterns = [
        r"ignore (?:previous )?instructions",
        r"system prompt",
        r"you are now a",
        r"override instructions",
        r"developer mode",
        r"forget what you",
        r"ignore all rules"
    ]
    for pattern in injection_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            log_trigger("Prompt Injection Attempt", "PRE-CHECK INPUT", text)
            return False, "injection"
            
    # 2. Abusive/Harassing Language Detection
    # Standard common abusive words/profanity
    abusive_words = ["abuse", "bastard", "idiot", "stupid", "fuck", "bitch", "asshole", "shit"]
    for word in abusive_words:
        if re.search(r'\b' + word + r'\b', text, re.IGNORECASE):
            log_trigger("Abusive Language Detected", "PRE-CHECK INPUT", text)
            return False, "abuse"
            
    return True, ""

def post_check_output(response: str, tool_outputs: list[str]) -> bool:
    """Ensure any numbers mentioned in the response match numbers returned by tool calls in the turn.
    
    Returns:
        True if safe, False if a number hallucination is detected.
    """
    if not tool_outputs:
        # If no tools were called, we don't enforce number checking (allows FAQ and greetings)
        return True
        
    # Extract all numbers from the agent's draft response
    # Matches positive integers and decimals
    response_numbers = set(re.findall(r'\b\d+(?:\.\d+)?\b', response))
    
    # Extract all numbers from all tool outputs in this turn
    tool_numbers = set()
    for out in tool_outputs:
        tool_numbers.update(re.findall(r'\b\d+(?:\.\d+)?\b', out))
        
    # If the response mentions numbers that were not returned by the tool, it's a hallucination!
    hallucinated_numbers = response_numbers - tool_numbers
    if hallucinated_numbers:
        log_trigger(
            "Hallucinated Number Output",
            "POST-CHECK OUTPUT",
            f"Response numbers: {response_numbers}, Tool numbers: {tool_numbers}. Hallucinated: {hallucinated_numbers}"
        )
        return False
        
    return True
