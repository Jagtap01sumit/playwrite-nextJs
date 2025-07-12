# server.py

from flask import Flask, request, jsonify
from main import handle_keyword_search, handle_url_health_check

app = Flask(__name__)

@app.route("/search", methods=["POST"])
def search_keyword():
    data = request.get_json()
    keyword = data.get("keyword")

    if not keyword:
        return jsonify({"error": "Keyword is required"}), 400

    result = handle_keyword_search(keyword)
    return jsonify(result), 200

@app.route("/check", methods=["POST"])
def check_url():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    result = handle_url_health_check(url)
    return jsonify(result), 200

if __name__ == "__main__":
    app.run(port=5000)
