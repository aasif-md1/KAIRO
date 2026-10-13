"""Mock GitHub OAuth and API server for local development and integration tests.

Implements:
- GET /login/oauth/authorize (Consent redirect)
- POST /login/oauth/access_token (Token exchange)
- GET /api/v3/user (Authenticated user profile)
- GET /api/v3/user/installations (GitHub App installations)
- GET /api/v3/user/repos (Accessible repositories)
- GET /api/v3/repos/{owner}/{repo}/zipball/{ref} (Repository archive download)
"""

import io
import json
import os
import sys
import urllib.parse
import zipfile
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = int(os.environ.get("PORT", 8080))

USERS = {
    "octocat": {
        "id": 583231,
        "login": "octocat",
        "name": "The Octocat",
        "email": "octocat@github.com",
        "avatar_url": "https://avatars.githubusercontent.com/u/583231",
    },
    "alice-dev": {
        "id": 100001,
        "login": "alice-dev",
        "name": "Alice Developer",
        "email": "alice@example.com",
        "avatar_url": "https://avatars.githubusercontent.com/u/100001",
    },
    "bob-tester": {
        "id": 100002,
        "login": "bob-tester",
        "name": "Bob Tester",
        "email": "bob@example.com",
        "avatar_url": "https://avatars.githubusercontent.com/u/100002",
    },
}

MOCK_REPOS = [
    {
        "id": 101,
        "name": "sample-vibe-app",
        "full_name": "octocat/sample-vibe-app",
        "private": False,
        "default_branch": "main",
        "html_url": "https://github.com/octocat/sample-vibe-app",
        "description": "A sample Express + Next.js app built with an AI coding assistant",
    },
    {
        "id": 102,
        "name": "notes-api",
        "full_name": "octocat/notes-api",
        "private": True,
        "default_branch": "main",
        "html_url": "https://github.com/octocat/notes-api",
        "description": "FastAPI notes app with user roles",
    },
]

def make_sample_repo_zip(repo_name: str) -> bytes:
    """Create an in-memory ZIP bundle simulating a downloaded repository."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        prefix = f"{repo_name}-main/"
        z.writestr(
            prefix + "package.json",
            json.dumps(
                {
                    "name": repo_name,
                    "version": "1.0.0",
                    "dependencies": {
                        "express": "^4.19.2",
                        "jsonwebtoken": "^9.0.2",
                    },
                },
                indent=2,
            ),
        )
        z.writestr(
            prefix + "index.js",
            """const express = require('express');
const app = express();
app.use(express.json());

// Intentionally flawed sample route for test scans
app.get('/api/users/:id', (req, res) => {
    // Missing auth and IDOR vulnerability
    res.json({ id: req.params.id, secret: 'vulnerable_data' });
});

app.listen(3000, () => console.log('Listening on 3000'));
""",
        )
        z.writestr(
            prefix + "README.md",
            f"# {repo_name}\nSample test repo provided by mock GitHub server.",
        )
    return buf.getvalue()


class MockGitHubHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep clean console
        sys.stderr.write(f"[MockGitHub] {format % args}\n")

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        # 1. OAuth Authorize
        if parsed.path == "/login/oauth/authorize":
            redirect_uri = params.get("redirect_uri", ["http://localhost:8000/auth/github/callback"])[0]
            state = params.get("state", [""])[0]
            # Automatically redirect with code
            selected_user = "octocat"
            code = f"mock_code_for_{selected_user}"
            delimiter = "&" if "?" in redirect_uri else "?"
            target = f"{redirect_uri}{delimiter}code={code}&state={state}"
            self.send_response(302)
            self.send_header("Location", target)
            self.end_headers()
            return

        # 2. Get User
        if parsed.path in ("/api/v3/user", "/user"):
            user = USERS["octocat"]
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(user).encode("utf-8"))
            return

        # 3. User Repos
        if parsed.path in ("/api/v3/user/repos", "/user/repos"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(MOCK_REPOS).encode("utf-8"))
            return

        # 4. App Installations
        if parsed.path in ("/api/v3/user/installations", "/user/installations"):
            resp = {
                "total_count": 1,
                "installations": [
                    {
                        "id": 999123,
                        "account": USERS["octocat"],
                        "target_type": "User",
                        "permissions": {"contents": "read", "metadata": "read"},
                    }
                ],
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(resp).encode("utf-8"))
            return

        # 5. Download repo zipball
        if "/zipball/" in parsed.path:
            parts = parsed.path.strip("/").split("/")
            repo_name = parts[2] if len(parts) > 2 else "sample-repo"
            zip_bytes = make_sample_repo_zip(repo_name)
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Disposition", f'attachment; filename="{repo_name}.zip"')
            self.end_headers()
            self.wfile.write(zip_bytes)
            return

        # Health
        if parsed.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)

        # Token exchange
        if parsed.path in ("/login/oauth/access_token", "/oauth/token"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            # Parse form or json
            code = "octocat"
            if "code=" in body:
                parsed_qs = urllib.parse.parse_qs(body)
                code = parsed_qs.get("code", ["octocat"])[0]
            elif body.startswith("{"):
                try:
                    data = json.loads(body)
                    code = data.get("code", "octocat")
                except Exception:
                    pass

            token_resp = {
                "access_token": f"ghu_mock_token_for_{code}",
                "token_type": "bearer",
                "scope": "read:user,repo",
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(token_resp).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()


def run(port=PORT):
    server = HTTPServer(("0.0.0.0", port), MockGitHubHandler)
    print(f"Mock GitHub server running at http://0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    run()
