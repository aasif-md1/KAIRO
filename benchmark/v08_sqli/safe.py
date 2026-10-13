# Safe: Parameterized SQL Query
import sqlite3

def get_user_profile(user_id: str):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # Safe: Prepared statement parameters
    query = "SELECT * FROM users WHERE id = ?"
    cursor.execute(query, (user_id,))
    return cursor.fetchone()
