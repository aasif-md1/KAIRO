import hashlib

# Vulnerable: Using MD5 for credential hashing
def hash_user_password(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()
