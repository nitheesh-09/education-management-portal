import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

type MenuItem = {
  label: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: "Overview", icon: "⌂" },
  { label: "My Courses", icon: "C" },
  { label: "My Classes", icon: "▦" },
  { label: "Attendance", icon: "✓" },
  { label: "Performance", icon: "%" },
  { label: "Profile", icon: "P" },
];

function StudentDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Overview");

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);

    switch (label) {
      case "Overview":
        navigate("/student");
        break;

      case "My Courses":
        navigate("/student/courses");
        break;

      case "My Classes":
        navigate("/student/classes");
        break;

      case "Attendance":
        navigate("/student/attendance");
        break;

      case "Performance":
        navigate("/student/performance");
        break;

      case "Profile":
        navigate("/student/profile");
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
    <div className="student-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="student-sidebar">

        {/* BRAND */}

        <div className="student-brand">

          <div className="student-brand-logo">
            AI
          </div>

          <div>
            <h2>Academic</h2>
            <span>Intelligence</span>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="student-navigation">

          <p className="student-nav-label">
            STUDENT
          </p>

          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`student-nav-item ${
                activeMenu === item.label ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.label)}
            >
              <span className="student-nav-icon">
                {item.icon}
              </span>

              <span className="student-nav-text">
                {item.label}
              </span>
            </button>
          ))}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="student-sidebar-bottom">

          <div className="student-user-mini">

            <div className="student-avatar">
              S
            </div>

            <div className="student-user-info">

              <strong>
                Student
              </strong>

              <span>
                Academic Account
              </span>

            </div>

          </div>


          <button
            type="button"
            className="student-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="student-main">

        {/* HEADER */}

        <header className="student-header">

          <div>

            <p className="student-page-label">
              STUDENT PORTAL
            </p>

            <h1>
              Welcome back, Student.
            </h1>

            <p className="student-header-description">
              Here's an overview of your academic activity.
            </p>

          </div>


          <div className="student-header-right">

            <div className="student-date">
              <span>◷</span>
              <span>Academic Overview</span>
            </div>

          </div>

        </header>


        {/* ================= STATISTICS ================= */}

        <section className="student-stat-grid">

          <div className="student-stat-card">

            <div className="student-stat-top">

              <span className="student-stat-label">
                My Courses
              </span>

              <div className="student-stat-icon">
                C
              </div>

            </div>

            <div className="student-stat-value">
              —
            </div>

            <div className="student-stat-footer">
              Courses will appear here
            </div>

          </div>


          <div className="student-stat-card">

            <div className="student-stat-top">

              <span className="student-stat-label">
                Classes
              </span>

              <div className="student-stat-icon">
                ▦
              </div>

            </div>

            <div className="student-stat-value">
              —
            </div>

            <div className="student-stat-footer">
              Your classes will appear here
            </div>

          </div>


          <div className="student-stat-card">

            <div className="student-stat-top">

              <span className="student-stat-label">
                Attendance
              </span>

              <div className="student-stat-icon">
                ✓
              </div>

            </div>

            <div className="student-stat-value">
              —
            </div>

            <div className="student-stat-footer">
              Attendance data unavailable
            </div>

          </div>


          <div className="student-stat-card">

            <div className="student-stat-top">

              <span className="student-stat-label">
                Performance
              </span>

              <div className="student-stat-icon">
                %
              </div>

            </div>

            <div className="student-stat-value">
              —
            </div>

            <div className="student-stat-footer">
              Performance data unavailable
            </div>

          </div>

        </section>


        {/* ================= CONTENT ================= */}

        <section className="student-content-grid">

          {/* COURSES */}

          <div className="student-panel">

            <div className="student-panel-header">

              <div>

                <h2>
                  My Courses
                </h2>

                <p>
                  Your enrolled courses
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/student/courses")
                }
              >
                View all →
              </button>

            </div>


            <div className="student-empty-state">

              <div className="student-empty-icon">
                C
              </div>

              <h3>
                No courses available
              </h3>

              <p>
                Your courses will appear here once
                they are assigned to your account.
              </p>

            </div>

          </div>


          {/* CLASSES */}

          <div className="student-panel">

            <div className="student-panel-header">

              <div>

                <h2>
                  My Classes
                </h2>

                <p>
                  Your upcoming classes
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/student/classes")
                }
              >
                View all →
              </button>

            </div>


            <div className="student-empty-state">

              <div className="student-empty-icon">
                ▦
              </div>

              <h3>
                No classes scheduled
              </h3>

              <p>
                Your class schedule will appear here.
              </p>

            </div>

          </div>

        </section>


        {/* ================= PERFORMANCE ================= */}

        <section className="student-panel student-performance-panel">

          <div className="student-panel-header">

            <div>

              <h2>
                Academic Performance
              </h2>

              <p>
                Your academic performance overview
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/performance")
              }
            >
              View details →
            </button>

          </div>


          <div className="student-performance-empty">

            <div className="student-performance-icon">
              %
            </div>

            <div>

              <h3>
                Performance data will appear here
              </h3>

              <p>
                Your marks and academic performance
                will be displayed once available.
              </p>

            </div>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="student-footer">

          <span>
            Academic Intelligence
          </span>

          <span>
            Student Portal
          </span>

        </footer>

      </main>

    </div>
  );
}

export default StudentDashboard;