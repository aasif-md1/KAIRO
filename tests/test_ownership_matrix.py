"""Cross-user tenant isolation and ownership dependency matrix test (M0-24, M0-25, NFR-S3).

Verifies:
1. Route table audit: Every project, scan, or finding route declares an ownership dependency.
2. Access matrix: A user accessing another user's project, scan, or finding receives 404 Not Found (never 403 or 200).
"""

import datetime
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from kairo_api.database import Base, engine
from kairo_api.dependencies.ownership import (
    require_finding_owner,
    require_project_owner,
    require_scan_owner,
)
from kairo_api.main import app
from kairo_api.models.finding import FindingRecord
from kairo_api.models.project import Attestation, Project
from kairo_api.models.scan import Scan
from kairo_api.models.user import Session as DbSession, User
from sqlalchemy.ext.asyncio import async_sessionmaker


@pytest_asyncio.fixture(autouse=True)
async def init_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


def test_route_table_ownership_audit():
    """NFR-S3 audit: Walk the route table to ensure all tenant-scoped routes declare ownership."""
    routes_checked = 0

    def get_all_deps(dependant):
        calls = []
        if not dependant:
            return calls
        for d in dependant.dependencies:
            calls.append(d.call)
            calls.extend(get_all_deps(d))
        return calls

    all_routes = []
    for r in app.routes:
        if hasattr(r, "original_router"):
            all_routes.extend(r.original_router.routes)
        else:
            all_routes.append(r)

    for route in all_routes:
        path = getattr(route, "path", "")
        # Inspect routes with {project_id}, {scan_id}, or {finding_id}
        if any(param in path for param in ["{project_id}", "{scan_id}", "{finding_id}"]):
            dependant = getattr(route, "dependant", None)
            calls = get_all_deps(dependant)
            has_ownership_dep = any(
                dep in (require_project_owner, require_scan_owner, require_finding_owner)
                for dep in calls
            )
            assert has_ownership_dep, (
                f"Security violation: Route '{path}' lacks an explicit ownership dependency!"
            )
            routes_checked += 1

    assert routes_checked > 0, "No tenant routes were discovered during route audit."


@pytest.mark.asyncio
async def test_cross_user_access_matrix():
    """Verify that User B probing User A's resources consistently receives 404 (not 403)."""
    now = datetime.datetime.now(datetime.timezone.utc)
    future = now + datetime.timedelta(days=7)

    # Create User A and User B
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as db:
        user_a = User(
            id="usr_alice",
            github_id=1111,
            login="alice",
            terms_accepted_at=now,
        )
        session_a = DbSession(
            id="ses_a",
            session_token="token_alice",
            user_id="usr_alice",
            expires_at=future,
        )
        project_a = Project(
            id="prj_alice_app",
            user_id="usr_alice",
            name="Alice Project",
        )
        attestation_a = Attestation(
            id="att_alice",
            project_id="prj_alice_app",
            user_id="usr_alice",
            terms_text="I own this app",
            content_hash="dummy_hash",
        )
        scan_a = Scan(
            id="scn_alice_1",
            project_id="prj_alice_app",
            user_id="usr_alice",
            status="running",
        )
        finding_a = FindingRecord(
            id="fnd_alice_1",
            project_id="prj_alice_app",
            scan_id="scn_alice_1",
            fingerprint="fp_alice_v01",
            vulnerability_class="V01",
            title="Missing Auth",
            severity="High",
            confidence="Likely",
            plain_language_explanation="Auth missing",
            remediation_advice="Add auth",
        )

        user_b = User(
            id="usr_bob",
            github_id=2222,
            login="bob",
            terms_accepted_at=now,
        )
        session_b = DbSession(
            id="ses_b",
            session_token="token_bob",
            user_id="usr_bob",
            expires_at=future,
        )

        db.add_all([user_a, session_a, project_a, attestation_a, scan_a, finding_a, user_b, session_b])
        await db.commit()

    headers_b = {
        "Authorization": "Bearer token_bob",
        "X-Test-Client": "true",
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        # User B attempts to access User A's project
        res1 = await client.get("/projects/prj_alice_app", headers=headers_b)
        assert res1.status_code == 404, f"Expected 404, got {res1.status_code}"

        res2 = await client.patch("/projects/prj_alice_app", json={"name": "Hacked"}, headers=headers_b)
        assert res2.status_code == 404

        res3 = await client.delete("/projects/prj_alice_app", headers=headers_b)
        assert res3.status_code == 404

        res4 = await client.put("/projects/prj_alice_app/config", json={"test_port": 8080}, headers=headers_b)
        assert res4.status_code == 404

        # User B attempts to access User A's scan
        res5 = await client.get("/scans/scn_alice_1", headers=headers_b)
        assert res5.status_code == 404

        res6 = await client.post("/scans/scn_alice_1/cancel", headers=headers_b)
        assert res6.status_code == 404

        res7 = await client.get("/scans/scn_alice_1/findings", headers=headers_b)
        assert res7.status_code == 404

        # User B attempts to access User A's finding
        res8 = await client.get("/findings/fnd_alice_1", headers=headers_b)
        assert res8.status_code == 404

        res9 = await client.patch("/findings/fnd_alice_1", json={"status": "dismissed"}, headers=headers_b)
        assert res9.status_code == 404

        res10 = await client.post("/findings/fnd_alice_1/recheck", headers=headers_b)
        assert res10.status_code == 404
