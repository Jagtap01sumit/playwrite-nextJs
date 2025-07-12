from playwright.sync_api import sync_playwright
from config.setting import HEADLESS

def launch_browser():
    playwright = sync_playwright().start()
    browser = playwright.chromium.launch(headless=HEADLESS, slow_mo=50)
    context = browser.new_context()
    page = context.new_page()
    return playwright, browser, context, page
