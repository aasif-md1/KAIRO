import os
import jwt

SECRET = os.environ.get("JWT_SECRET", "super-strong-production-key-32chars")

# Safe: Cryptographic verification enabled with secure algorithm
def verify_token(token_str: str):
    payload = jwt.decode(
        token_str,
        SECRET,
        algorithms=["HS256"],
        options={"verify_signature": True},
    )
    return payload
