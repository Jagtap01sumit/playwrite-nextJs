import os
from datetime import datetime

def save_html_report(url, result_dict):
   
    safe_url = url.replace("https://", "").replace("http://", "").replace("/", "_")
    
    # Create result directory if it doesn't exist
    os.makedirs("result", exist_ok=True)

    filepath = f"./result/{safe_url}_report.html"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"""
            <html>
    <head>
        <title>Website Health Report</title>
        <style>
            body {{ font-family: sans-serif; background-color: #f9f9f9; padding: 20px; }}
            h1 {{ color: #333; }}
            .result {{ background: white; padding: 15px; border-radius: 10px; box-shadow: 0 0 10px #ddd; }}
            .ok {{ color: green; }}
            .fail {{ color: red; }}
        </style>
    </head>
    <body>
        <h1>Website Health Report</h1>
        <div class="result">
            <p><strong>URL:</strong> {result_dict.get('url')}</p>
            <p><strong>Status:</strong> {'✅ OK' if result_dict.get('status_ok') else '❌ Error'}</p>
            <p><strong>Responsive:</strong> {'✅ Yes' if result_dict.get('responsive') else '❌ No'}</p>
            <p><strong>SSL Valid:</strong> {'✅ Yes' if result_dict.get('ssl_ok') else '❌ No'}</p>
            <p><strong>SSL Info:</strong> {result_dict.get('ssl_info')}</p>
            <p><strong>Load Time:</strong> {result_dict.get('load_time', 'N/A')} sec</p>
            <p><strong>Checked On:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
    </body>
    </html>
    """)
    
    print(f"✅ HTML report saved to: {filepath}")
    print(f"✅ Saved HTML report: {filepath}")
