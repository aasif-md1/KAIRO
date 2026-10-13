import jwt

# Vulnerable: Insecure JWT decode with signature verification disabled
def verify_token(token_str: str):
    payload = jwt.decode(token_str, options={"verify_signature": False})
    return payload
