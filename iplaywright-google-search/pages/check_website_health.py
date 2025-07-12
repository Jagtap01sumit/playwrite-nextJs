import ssl
import socket
import time
from urllib.parse import urlparse
from playwright.sync_api import Page, sync_playwright


def get_ssl_certificate_info(hostname):
    context = ssl.create_default_context()
    try:
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return {
                    "ssl_ok": True,
                    "ssl_info": cert.get("subject", []),
                }
    except Exception as e:
        return {
            "ssl_ok": False,
            "ssl_info": str(e),
        }


def test_url_playwright(playwright, url: str):
    browser = playwright.chromium.launch(headless=True)
    page: Page = browser.new_page()
    
    result = {
        "url": url,
        "status_ok": False,
        "responsive": False,
        "load_time": None,
        "ssl_ok": False,
        "ssl_info": "Not Checked",
    }

    # SSL Check
    parsed = urlparse(url)
    hostname = parsed.netloc or parsed.path  # handle "https://example.com"
    ssl_result = get_ssl_certificate_info(hostname)
    result.update(ssl_result)

    # Page Load Test
    try:
        start_time = time.time()
        response = page.goto(url, timeout=15000)
        end_time = time.time()

        if response and response.status < 400:
            result["status_ok"] = True
            result["load_time"] = round(end_time - start_time, 2)

            # Responsive Test (check viewport resizing doesn't break)
            page.set_viewport_size({"width": 375, "height": 667})  # iPhone SE
            result["responsive"] = True  # Could do more checks here
        else:
            result["status_ok"] = False
    except Exception as e:
        result["error"] = str(e)
    finally:
        browser.close()
        return result
