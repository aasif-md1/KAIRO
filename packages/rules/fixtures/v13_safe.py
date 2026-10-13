import os
from flask import Flask

app = Flask(__name__)

@app.route("/status")
def status():
    return {"status": "ok"}

# Safe: Debug disabled in production
if __name__ == "__main__":
    is_debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=5000, debug=False)
