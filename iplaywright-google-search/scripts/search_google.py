from mainUtilies.browser_setup import launch_browser
from pages.google_page import GooglePage
from config.settings import SEARCH_KEYWORD

def run_search():
    playwright, browser, context = get_browser()
    page = context.new_page()

    search = launch_browser(page)

    search.search(SEARCH_KEYWORD)

    input("Press Enter to close browser...")
    browser.close()
    playwright.stop()

if __name__ == "__main__":
    run_search()
