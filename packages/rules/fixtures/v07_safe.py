import hashlib
import os

# Safe: Strong cryptographic hashing with salt and SHA-256
def hash_user_password(password: str) -> str:
    salt = os.urandom(16)
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000).hex()
