import os

# Safe: Credentials retrieved from runtime environment variables
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")

def get_client():
    return {"key": AWS_ACCESS_KEY_ID, "stripe": STRIPE_SECRET_KEY}
