from pages.google_page import search_duckduckgo
from pages.results_page import extract_result_links, save_links_to_file
from config.setting import SEARCH_KEYWORD

def main():
    playwright, browser, page =search_duckduckgo(SEARCH_KEYWORD)
    # extract_results(page, browser)
    urls = extract_result_links(page)
    save_links_to_file(SEARCH_KEYWORD, urls)

    # browser.close()
    playwright.stop()

    

if __name__ == "__main__":
    main()
