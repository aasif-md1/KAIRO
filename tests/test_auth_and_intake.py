"""End-to-end test of sign-in, intake (GitHub & ZIP), attestation, and scan lifecycle (Gate 0 criteria)."""

import io
import zipfile
import pytest
from httpx import ASGITransport, AsyncClient
from kairo_api.database import Base, engine
from kairo_api.main import app
from kairo_api.models.user import User


@pytest.fixture(autouse=True)
async def init_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


@pytest.mark.asyncio
async def test_full_auth_and_intake_workflow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Health check
        health_res = await client.get("/health")
        assert health_res.status_code == 200
        assert health_res.json()["status"] == "ok"

        # 2. Simulate OAuth login / callback using mock token
        # Create a mock session directly
        from kairo_api.models.user import Session as DbSession
        import datetime, secrets
        from sqlalchemy.ext.asyncio import async_sessionmaker

        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        async with session_factory() as db:
            user = User(
                id="usr_test_octocat",
                github_id=99999,
                login="octocat",
                name="The Octocat",
                email="octocat@github.com",
            )
            session = DbSession(
                id="ses_test_123",
                session_token="mock_session_token",
                user_id=user.id,
                expires_at=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
            )
            db.add_all([user, session])
            await db.commit()

        auth_headers = {
            "Authorization": "Bearer mock_session_token",
            "X-Test-Client": "true",
        }

        # 3. Check /me
        me_res = await client.get("/me", headers=auth_headers)
        assert me_res.status_code == 200
        assert me_res.json()["login"] == "octocat"
        assert me_res.json()["terms_accepted"] is False

        # 4. Accept terms (LR-4)
        terms_res = await client.post(
            "/me/terms",
            json={
                "terms_version": "2026-10-10",
                "terms_text": "I accept the KAIRO terms of service.",
            },
            headers=auth_headers,
        )
        assert terms_res.status_code == 200

        # Verify terms accepted
        me_res2 = await client.get("/me", headers=auth_headers)
        assert me_res2.json()["terms_accepted"] is True

        # 5. Create project via GitHub intake (FR-I1)
        p_res = await client.post(
            "/projects",
            json={
                "name": "sample-vibe-app",
                "repo_full_name": "octocat/sample-vibe-app",
                "default_branch": "main",
                "source_type": "github",
            },
            headers=auth_headers,
        )
        assert p_res.status_code == 201
        project_id = p_res.json()["id"]

        # 6. Create another project via ZIP intake (FR-I2)
        p_zip_res = await client.post(
            "/projects",
            json={
                "name": "uploaded-zip-app",
                "source_type": "archive",
            },
            headers=auth_headers,
        )
        assert p_zip_res.status_code == 201
        zip_project_id = p_zip_res.json()["id"]

        # Build in-memory safe zip
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w") as z:
            z.writestr("package.json", '{"name":"zip-app"}')
            z.writestr("index.js", 'console.log("hello");')
        buf.seek(0)

        upload_res = await client.post(
            f"/projects/{zip_project_id}/archive",
            files={"file": ("code.zip", buf.getvalue(), "application/zip")},
            headers=auth_headers,
        )
        assert upload_res.status_code == 200
        assert upload_res.json()["status"] == "extracted"

        # 7. Attestation requirement before scan (LR-1, US-05)
        # Scan without attestation should fail (400)
        scan_fail_res = await client.post(
            f"/projects/{project_id}/scans",
            json={"layers": ["static", "dynamic"]},
            headers=auth_headers,
        )
        assert scan_fail_res.status_code == 400
        assert "attestation" in scan_fail_res.json()["detail"].lower()

        # Confirm attestation
        att_res = await client.post(
            f"/projects/{project_id}/attestation",
            json={"terms_text": "I confirm I am authorized to test this repository."},
            headers=auth_headers,
        )
        assert att_res.status_code == 200

        # 8. Start scan succeeds
        scan_res = await client.post(
            f"/projects/{project_id}/scans",
            json={"layers": ["static", "dynamic"]},
            headers=auth_headers,
        )
        assert scan_res.status_code == 201
        scan_id = scan_res.json()["id"]
        assert scan_res.json()["status"] == "running"

        # 9. Get scan details
        details_res = await client.get(f"/scans/{scan_id}", headers=auth_headers)
        assert details_res.status_code == 200
        assert details_res.json()["id"] == scan_id
        assert len(details_res.json()["stages"]) > 0

        # 10. Data export (LR-9)
        export_res = await client.get("/me/export", headers=auth_headers)
        assert export_res.status_code == 200
        data = export_res.json()
        assert len(data["projects"]) == 2
        assert len(data["scans"]) == 1
