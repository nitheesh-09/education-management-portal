import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";

type MenuItem = {
  label: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: "Overview", icon: "⌂" },
  { label: "My Courses", icon: "C" },
  { label: "My Classes", icon: "▦" },
  { label: "Students", icon: "S" },
  { label: "Attendance", icon: "✓" },
  { label: "Performance", icon: "%" },
  { label: "Profile", icon: "P" },
];

function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Overview");

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);

    switch (label) {
      case "Overview":
        navigate("/teacher");
        break;

      case "My Courses":
        navigate("/teacher/courses");
        break;

      case "My Classes":
        navigate("/teacher/classes");
        break;

      case "Students":
        navigate("/teacher/students");
        break;

      case "Attendance":
        navigate("/teacher/attendance");
        break;

      case "Performance":
        navigate("/teacher/performance");
        break;

      case "Profile":
        navigate("/teacher/profile");
        break;

      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="teacher-layout">

      {/* SIDEBAR */}

      <aside className="teacher-sidebar">

        <div className="teacher-brand">

          <div className="teacher-brand-logo">
            AI
          </div>

          <div>
            <h2>Academic</h2>
            <span>Intelligence</span>
          </div>

        </div>


        <nav className="teacher-navigation">

          <p className="teacher-nav-label">
            TEACHER
          </p>

          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`teacher-nav-item ${
                activeMenu === item.label ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.label)}
            >
              <span className="teacher-nav-icon">
                {item.icon}
              </span>

              <span className="teacher-nav-text">
                {item.label}
              </span>
            </button>
          ))}

        </nav>


        <div className="teacher-sidebar-bottom">

          <div className="teacher-user-mini">

            <div className="teacher-avatar">
              T
            </div>

            <div className="teacher-user-info">

              <strong>
                Teacher
              </strong>

              <span>
                Academic Account
              </span>

            </div>

          </div>


          <button
            type="button"
            className="teacher-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="teacher-main">

        <header className="teacher-header">

          <div>

            <p className="teacher-page-label">
              TEACHER PORTAL
            </p>

            <h1>
              Welcome back, Teacher.
            </h1>

            <p className="teacher-header-description">
              Here's an overview of your academic activities.
            </p>

          </div>


          <div className="teacher-header-right">

            <div className="teacher-date">
              <span>◷</span>
              <span>Academic Overview</span>
            </div>

          </div>

        </header>


        {/* STATISTICS */}

        <section className="teacher-stat-grid">

          <div className="teacher-stat-card">

            <div className="teacher-stat-top">

              <span className="teacher-stat-label">
                My Courses
              </span>

              <div className="teacher-stat-icon">
                C
              </div>

            </div>

            <div className="teacher-stat-value">
              —
            </div>

            <div className="teacher-stat-footer">
              Assigned courses will appear here
            </div>

          </div>


          <div className="teacher-stat-card">

            <div className="teacher-stat-top">

              <span className="teacher-stat-label">
                My Classes
              </span>

              <div className="teacher-stat-icon">
                ▦
              </div>

            </div>

            <div className="teacher-stat-value">
              —
            </div>

            <div className="teacher-stat-footer">
              Assigned classes will appear here
            </div>

          </div>


          <div className="teacher-stat-card">

            <div className="teacher-stat-top">

              <span className="teacher-stat-label">
                Students
              </span>

              <div className="teacher-stat-icon">
                S
              </div>

            </div>

            <div className="teacher-stat-value">
              —
            </div>

            <div className="teacher-stat-footer">
              Student information unavailable
            </div>

          </div>


          <div className="teacher-stat-card">

            <div className="teacher-stat-top">

              <span className="teacher-stat-label">
                Attendance
              </span>

              <div className="teacher-stat-icon">
                ✓
              </div>

            </div>

            <div className="teacher-stat-value">
              —
            </div>

            <div className="teacher-stat-footer">
              Attendance data unavailable
            </div>

          </div>

        </section>


        {/* CONTENT */}

        <section className="teacher-content-grid">

          <div className="teacher-panel">

            <div className="teacher-panel-header">

              <div>
                <h2>My Classes</h2>

                <p>
                  Your assigned classes
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/teacher/classes")
                }
              >
                View all →
              </button>

            </div>


            <div className="teacher-empty-state">

              <div className="teacher-empty-icon">
                ▦
              </div>

              <h3>
                No classes available
              </h3>

              <p>
                Classes assigned to you will appear here.
              </p>

            </div>

          </div>


          <div className="teacher-panel">

            <div className="teacher-panel-header">

              <div>
                <h2>Students</h2>

                <p>
                  Students assigned to your classes
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/teacher/students")
                }
              >
                View all →
              </button>

            </div>


            <div className="teacher-empty-state">

              <div className="teacher-empty-icon">
                S
              </div>

              <h3>
                No students available
              </h3>

              <p>
                Students will appear here once
                they are assigned to your classes.
              </p>

            </div>

          </div>

        </section>


        {/* ACADEMIC PERFORMANCE */}

        <section className="teacher-panel teacher-performance-panel">

          <div className="teacher-panel-header">

            <div>

              <h2>
                Academic Performance
              </h2>

              <p>
                Manage student academic performance
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/teacher/performance")
              }
            >
              View details →
            </button>

          </div>


          <div className="teacher-performance-empty">

            <div className="teacher-performance-icon">
              %
            </div>

            <div>

              <h3>
                Performance data will appear here
              </h3>

              <p>
                Student performance information will be
                available once records are created.
              </p>

            </div>

          </div>

        </section>


        <footer className="teacher-footer">

          <span>
            Academic Intelligence
          </span>

          <span>
            Teacher Portal
          </span>

        </footer>

      </main>

    </div>
  );
}

export default TeacherDashboard;