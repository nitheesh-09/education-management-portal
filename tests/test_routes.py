from app.main import app


EXPECTED_ROUTES = {
    "/auth/login",
    "/auth/me",
    "/admin/students",
    "/admin/teachers",
    "/admin/courses",
    "/admin/classes",
    "/admin/enrollments",
    "/admin/assignments",
    "/admin/exams",
    "/student/profile",
    "/student/courses",
    "/student/assignments",
    "/student/exams",
    "/student/attendance",
    "/student/submissions",
    "/student/results",
    "/student/performance",
    "/student/recommendations",
    "/student/ai-prediction",
    "/teacher/profile",
    "/teacher/courses",
    "/teacher/assignments",
    "/teacher/submissions",
    "/teacher/exams",
    "/teacher/attendance",
    "/teacher/results",
    "/dashboard/admin",
    "/dashboard/student",
    "/dashboard/teacher",
    "/reports/overview",
    "/ai/students/{student_id}/analyze",
}


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


def test_expected_routes_are_registered() -> None:
    registered_paths = get_registered_paths()

    assert EXPECTED_ROUTES <= registered_paths