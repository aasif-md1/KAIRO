# Vulnerable: Hardcoded API secret in source code
import os

# Flaw: Raw API key hardcoded in source
STRIPE_API_SECRET = "stripe_secret_51NABCxyz9876543210abcdefghijklmnop"

def charge_customer(amount: int):
    print(f"Charging {amount} with key {STRIPE_API_SECRET}")
