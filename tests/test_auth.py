from fastapi.testclient import TestClient

from app.auth import router as auth_router
from app.main import app


class EmptyUserSession:
    def scalar(self, statement):
        return None

    def close(self) -> None:
        pass


def get_registered_paths() -> set[str]:
    registered_paths = {
        route.path
        for route in app.routes
        if hasattr(route, "path")
    }

    for included_router in app.routes:
        if hasattr(included_router, "original_router"):
            registered_paths.update(
                route.path
                for route in included_router.original_router.routes
                if hasattr(route, "path")
            )

    return registered_paths


def test_login_route_is_registered() -> None:
    registered_paths = get_registered_paths()

    assert "/auth/login" in registered_paths


def test_login_with_invalid_credentials_returns_401(monkeypatch) -> None:
    monkeypatch.setattr(auth_router, "SessionLocal", EmptyUserSession)

    client = TestClient(app)

    response = client.post(
        "/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "invalid-password",
        },
    )

    assert response.status_code == 401