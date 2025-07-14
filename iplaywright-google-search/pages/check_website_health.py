import ssl
import socket
import time
import os
import requests
from urllib.parse import urlparse
from playwright.sync_api import Page

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
    page = browser.new_page()

    result = {
        "url": url,
        "status_ok": False,
        "responsive": False,
        "load_time": None,
        "ssl_ok": False,
        "ssl_info": "Not Checked",
        "screenshots": {},
        "seo": {},
        "security_headers": {},
        "broken_links": [],
        "accessibility": "Not checked yet"
    }

    parsed = urlparse(url)
    hostname = parsed.netloc or parsed.path
    ssl_result = get_ssl_certificate_info(hostname)
    result.update(ssl_result)

    try:
       
        security_headers = {}

        def handle_response(resp):
            if resp.request.resource_type == "document" and urlparse(resp.url).netloc == hostname:
                h = resp.headers
                security_headers.update({
                    "Content-Security-Policy": h.get("content-security-policy"),
                    "Strict-Transport-Security": h.get("strict-transport-security"),
                    "X-Content-Type-Options": h.get("x-content-type-options"),
                    "X-Frame-Options": h.get("x-frame-options"),
                    "Referrer-Policy": h.get("referrer-policy"),
                })

        page.on("response", handle_response)
     
        start = time.time()
        response = page.goto(url, timeout=15000)
        load_time = time.time() - start

        if response and response.status < 400:
            result["status_ok"] = True
            result["load_time"] = round(load_time, 2)

            # Responsive Test
            try:
                page.set_viewport_size({"width": 375, "height": 667})
                time.sleep(1)
                result["responsive"] = True
            except Exception:
                result["responsive"] = False
                os.makedirs("screenshots", exist_ok=True)
                path = f"screenshots/{hostname}_non_responsive.png"
                page.screenshot(path=path)
                result["screenshots"]["responsive"] = path

            
            result["seo"]["title"] = page.title()
            result["seo"]["meta_description"] = page.locator("meta[name='description']").get_attribute("content")
            result["seo"]["canonical"] = page.locator("link[rel='canonical']").get_attribute("href")
            result["seo"]["robots"] = page.locator("meta[name='robots']").get_attribute("content")

        
            result["security_headers"] = security_headers

            
            anchors = page.query_selector_all("a")
            for anchor in anchors:
                href = anchor.get_attribute("href")
                if href and href.startswith("http"):
                    try:
                        link_response = requests.head(href, timeout=5)
                        if link_response.status_code >= 400:
                            result["broken_links"].append(href)
                    except Exception:
                        result["broken_links"].append(href)

            if result["broken_links"]:
                os.makedirs("screenshots", exist_ok=True)
                path = f"screenshots/{hostname}_broken_links.png"
                page.screenshot(path=path)
                result["screenshots"]["broken_links"] = path

        else:
            result["status_ok"] = False
            os.makedirs("screenshots", exist_ok=True)
            path = f"screenshots/{hostname}_unreachable.png"
            page.screenshot(path=path)
            result["screenshots"]["unreachable"] = path

    except Exception as e:
        result["error"] = str(e)
        os.makedirs("screenshots", exist_ok=True)
        path = f"screenshots/{hostname}_error.png"
        page.screenshot(path=path)
        result["screenshots"]["error"] = path

    finally:
        browser.close()
        return result
