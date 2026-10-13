# Vulnerable: SQL Query constructed via string interpolation
import sqlite3

def get_user_profile(user_id: str):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # Flaw: Raw SQL concatenation
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    cursor.execute(query)
    return cursor.fetchone()
