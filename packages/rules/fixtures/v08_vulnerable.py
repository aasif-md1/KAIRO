def get_user_profile(cursor, username: str):
    # Vulnerable: Direct f-string interpolation into SQL query execution
    return cursor.execute(f"SELECT * FROM users WHERE username = '{username}'").fetchall()
