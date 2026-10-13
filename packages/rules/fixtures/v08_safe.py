def get_user_profile(cursor, username: str):
    # Safe: Parameterized query using bind parameters
    query = "SELECT * FROM users WHERE username = ?"
    return cursor.execute(query, (username,)).fetchall()
