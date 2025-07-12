from mainUtilies.browser_setup import launch_browser
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
import time
import random

def search_duckduckgo(keyword):
    playwright, browser, context, page = launch_browser()

    try:
        page.goto("https://duckduckgo.com", timeout=60000)

        page.wait_for_selector("input[name='q']", timeout=10000)
        time.sleep(random.uniform(1, 2))
        page.fill("input[name='q']", keyword)
        page.keyboard.press("Enter")

        page.wait_for_selector("a.result__a", timeout=10000)
        page.click("a.result__a")

        print(f"Search for '{keyword}' successful!")

        # Keep browser open
        page.wait_for_timeout(10000)
        return playwright, browser,  page 

    except PlaywrightTimeoutError as e:
        print("Timeout occurred:", e)

    finally:
        # Comment this line if you want to keep browser open
        # browser.close()
        pass
