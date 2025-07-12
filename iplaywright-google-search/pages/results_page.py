import os

def extract_result_links(page):
    links = page.query_selector_all("//h2/a")
    for link in links:
        print(link.get_attribute("href"))


    urls = [link.get_attribute("href") for link in links if link.get_attribute("href")]
    return urls;

def save_links_to_file(keyword, urls):
   
    os.makedirs("results", exist_ok=True)  # Create results folder if not exists
    filename = f"results/{keyword.lower().replace(' ', '_')}_links.txt"
    with open(filename, "w", encoding="utf-8") as f:
        for url in urls:
            print("hello suit")
            f.write(url + "\n")
    print(f"\n✅ Saved {len(urls)} links to: {filename}")
