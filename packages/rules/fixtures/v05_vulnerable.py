# Vulnerable: Hardcoded AWS credentials and API keys
AWS_ACCESS_KEY_ID = "AKIA1234567890ABCDEF"
STRIPE_SECRET_KEY = "stripe_secret_1234567890abcdef1234567890"

def get_client():
    return {"key": AWS_ACCESS_KEY_ID, "stripe": STRIPE_SECRET_KEY}
