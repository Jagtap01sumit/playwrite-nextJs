from dotenv import load_dotenv
import os

load_dotenv()  # This must be at the top and executed before any os.getenv()

HEADLESS = os.getenv("HEADLESS", "True") == "True"


SEARCH_KEYWORD = os.getenv("SEARCH_KEYWORD", "hotel")
