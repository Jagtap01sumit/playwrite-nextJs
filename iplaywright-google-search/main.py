# main.py

from pages.google_page import search_duckduckgo
from pages.results_page import extract_result_links, save_links_to_file
from pages.check_website_health import test_url_playwright
from mainUtilies.html_report import save_html_report
from playwright.sync_api import sync_playwright

def handle_keyword_search(keyword):
    with sync_playwright() as playwright:
        playwright, browser, page = search_duckduckgo(keyword)
        urls = extract_result_links(page)
        save_links_to_file(keyword, urls)
        browser.close()
        playwright.stop()
        return {"message": "Search completed", "urls": urls}

def handle_url_health_check(url):
    with sync_playwright() as playwright:
        result = test_url_playwright(playwright, url)
        print("this is url now creating report...")
        save_html_report(url, result)
        playwright.stop()
        return {"message": "Health check completed", "report": result}
