import os
import boto3
import requests
from datetime import datetime
from dotenv import load_dotenv


# Load values from .env file
load_dotenv()

# Access and print
print("BUCKET_NAME =", os.getenv("BUCKET_NAME"))
print(" region_name is",os.getenv("AWS_REGION"),)

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    region_name=os.getenv("AWS_REGION"),
)
BUCKET_NAME = os.getenv("BUCKET_NAME")
print("this is bucket name ",BUCKET_NAME);

def save_html_report(url, result_dict):
    safe_url = url.replace("https://", "").replace("http://", "").replace("/", "_")
    report_filename = f"{safe_url}_report.html"
 
    s3_key = f"reports/{report_filename}" 
    print("S3_KEY IS",s3_key);
    def img_tag(path):
        return f'<br><img src="../{path}" width="500">' if path else ""

    # Generate HTML content
    html_content = f"""
        <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Health Report</title>
    <style>
        body {{
            font-family: sans-serif;
            background-color: #f9f9f9;
            padding: 2vw;
            margin: 0;
        }}
        h1 {{
            color: #333;
            font-size: 6vw;
            text-align: center;
        }}
        .result {{
            background: white;
            padding: 2em;
            border-radius: 10px;
            box-shadow: 0 0 10px #ddd;
            max-width: 800px;
            margin: 2em auto;
        }}
        .ok {{ color: green; }}
        .fail {{ color: red; }}
        img {{
            width: 100%;
            height: auto;
            border-radius: 6px;
            margin-top: 1em;
        }}
        pre {{
            white-space: pre-wrap;
            word-wrap: break-word;
            background: #f0f0f0;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
        }}
        p {{
            line-height: 1.6;
            font-size: 1em;
        }}
    </style>
</head>
<body>
    <h1>Website Health Report</h1>
    <div class="result">
        <p><strong>URL:</strong> {result_dict.get('url')}</p>
        <p><strong>Status:</strong> {'✅ OK' if result_dict.get('status_ok') else '❌ Error'}</p>
        <p><strong>Responsive:</strong> {'✅ Yes' if result_dict.get('responsive') else '❌ No'}{img_tag(result_dict['screenshots'].get('responsive'))}</p>
        <p><strong>SSL Valid:</strong> {'✅ Yes' if result_dict.get('ssl_ok') else '❌ No'}</p>
        <p><strong>SSL Info:</strong> {result_dict.get('ssl_info')}</p>
        <p><strong>Load Time:</strong> {result_dict.get('load_time', 'N/A')} sec</p>
        <p><strong>Broken Links:</strong> {len(result_dict.get('broken_links', []))} {img_tag(result_dict['screenshots'].get('broken_links'))}</p>
        <p><strong>Security Headers:</strong><pre>{result_dict.get('security_headers')}</pre></p>
        <p><strong>SEO Data:</strong><pre>{result_dict.get('seo')}</pre></p>
        <p><strong>Checked On:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    </div>
</body>
</html>
"""


    # Create pre-signed URL
    try:
        presigned_url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": BUCKET_NAME,
            "Key": s3_key,
            "ContentType": "text/html"
        },
        ExpiresIn=3000  # 5 minutes
        )

        response = requests.put(
            presigned_url,
            data=html_content.encode("utf-8"),
            headers={"Content-Type": "text/html"}
        )
        if response.status_code == 200:
            public_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/reports/{report_filename}"
            print(f"✅ Report uploaded to S3: {public_url}")
            return { "status":200 ,"report_name":report_filename};
        else:
            print(f"❌ Upload failed with status code: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Upload via presigned URL failed: {e}")
        print(f"🔑 Pre-signed URL created.")
    except Exception as e:
        print(f"❌ Failed to create pre-signed URL: {e}")
        return

   
   