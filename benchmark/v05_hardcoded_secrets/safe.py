# Safe: Secret retrieved from environment variable
import os

STRIPE_API_SECRET = os.environ.get("STRIPE_API_SECRET")

def charge_customer(amount: int):
    if not STRIPE_API_SECRET:
        raise RuntimeError("Missing STRIPE_API_SECRET environment variable")
    print(f"Charging {amount}")
