import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

type MenuItem = {
  label: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: "Overview", icon: "⌂" },
  { label: "Students", icon: "S" },
  { label: "Teachers", icon: "T" },
  { label: "Courses", icon: "C" },
  { label: "Classes", icon: "▦" },
  { label: "Analytics", icon: "↗" },
  { label: "AI Insights", icon: "✦" },
  { label: "Reports", icon: "▤" },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Overview");

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);

    switch (label) {
      case "Overview":
        navigate("/admin");
        break;

      case "Students":
        navigate("/admin/students");
        break;

      case "Teachers":
        navigate("/admin/teachers");
        break;

      case "Courses":
        navigate("/admin/courses");
        break;

      case "Classes":
        navigate("/admin/classes");
        break;

      case "Analytics":
        navigate("/admin/analytics");
        break;

      case "AI Insights":
        navigate("/admin/ai-insights");
        break;

      case "Reports":
        navigate("/admin/reports");
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
    <div className="admin-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">

        {/* BRAND */}

        <div className="admin-brand">

          <div className="admin-brand-logo">
            AI
          </div>

          <div>
            <h2>Academic</h2>
            <span>Intelligence</span>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-navigation">

          <p className="admin-nav-label">
            MANAGEMENT
          </p>

          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`admin-nav-item ${
                activeMenu === item.label ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.label)}
            >

              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span className="admin-nav-text">
                {item.label}
              </span>

            </button>
          ))}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <div className="admin-user-mini">

            <div className="admin-avatar">
              A
            </div>

            <div className="admin-user-info">

              <strong>
                Administrator
              </strong>

              <span>
                Institution Admin
              </span>

            </div>

          </div>


          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <p className="admin-page-label">
              ADMINISTRATION
            </p>

            <h1>
              Good morning, Administrator.
            </h1>

            <p className="admin-header-description">
              Here's what's happening across your
              institution today.
            </p>

          </div>


          <div className="admin-header-right">

            <div className="admin-date">

              <span className="date-icon">
                ◷
              </span>

              <span>
                Academic Overview
              </span>

            </div>

          </div>

        </header>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="admin-stat-grid">

          {/* STUDENTS */}

          <div className="admin-stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Total Students
              </span>

              <div className="stat-icon">
                S
              </div>

            </div>

            <div className="stat-value">
              1,248
            </div>

            <div className="stat-footer positive">
              <span>↗</span>
              8.4% this semester
            </div>

          </div>


          {/* TEACHERS */}

          <div className="admin-stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Total Teachers
              </span>

              <div className="stat-icon">
                T
              </div>

            </div>

            <div className="stat-value">
              86
            </div>

            <div className="stat-footer positive">
              <span>↗</span>
              3 new this month
            </div>

          </div>


          {/* COURSES */}

          <div className="admin-stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Active Courses
              </span>

              <div className="stat-icon">
                C
              </div>

            </div>

            <div className="stat-value">
              32
            </div>

            <div className="stat-footer neutral">
              Across 8 departments
            </div>

          </div>


          {/* PERFORMANCE */}

          <div className="admin-stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Avg. Performance
              </span>

              <div className="stat-icon">
                %
              </div>

            </div>

            <div className="stat-value">
              78.4%
            </div>

            <div className="stat-footer positive">
              <span>↗</span>
              4.2% improvement
            </div>

          </div>

        </section>


        {/* =====================================================
            CONTENT GRID
        ===================================================== */}

        <section className="admin-content-grid">

          {/* PERFORMANCE PANEL */}

          <div className="admin-panel performance-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Academic Performance
                </h2>

                <p>
                  Institution-wide average performance
                </p>

              </div>


              <select className="panel-select">

                <option>
                  This Semester
                </option>

                <option>
                  Last Semester
                </option>

                <option>
                  This Year
                </option>

              </select>

            </div>


            {/* CHART */}

            <div className="performance-chart">

              <div className="chart-y-axis">

                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>

              </div>


              <div className="chart-area">

                <div className="chart-grid-line line-1" />
                <div className="chart-grid-line line-2" />
                <div className="chart-grid-line line-3" />
                <div className="chart-grid-line line-4" />
                <div className="chart-grid-line line-5" />


                <div className="chart-bars">

                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "55%" }}
                    />

                    <span>
                      Jan
                    </span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "62%" }}
                    />

                    <span>
                      Feb
                    </span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "58%" }}
                    />

                    <span>
                      Mar
                    </span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "70%" }}
                    />

                    <span>
                      Apr
                    </span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "74%" }}
                    />

                    <span>
                      May
                    </span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar current"
                      style={{ height: "78%" }}
                    />

                    <span>
                      Jun
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="admin-panel quick-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Common administrative tasks
                </p>

              </div>

            </div>


            <div className="quick-actions">

              {/* ADD STUDENT */}

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/admin/students")
                }
              >

                <div className="quick-icon">
                  +
                </div>

                <div>

                  <strong>
                    Add Student
                  </strong>

                  <span>
                    Create a new student account
                  </span>

                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>


              {/* ADD TEACHER */}

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/admin/teachers")
                }
              >

                <div className="quick-icon">
                  +
                </div>

                <div>

                  <strong>
                    Add Teacher
                  </strong>

                  <span>
                    Create a new teacher account
                  </span>

                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>


              {/* VIEW ANALYTICS */}

              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/admin/analytics")
                }
              >

                <div className="quick-icon">
                  ↗
                </div>

                <div>

                  <strong>
                    View Analytics
                  </strong>

                  <span>
                    Explore institution metrics
                  </span>

                </div>

                <span className="quick-arrow">
                  →
                </span>

              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            RECENT ACTIVITY
        ===================================================== */}

        <section className="admin-panel activity-panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Activity
              </h2>

              <p>
                Latest updates from your institution
              </p>

            </div>


            <button
              type="button"
              className="view-all-button"
            >
              View all →
            </button>

          </div>


          <div className="activity-list">

            {/* STUDENT */}

            <div className="activity-item">

              <div className="activity-avatar student">
                S
              </div>

              <div className="activity-details">

                <strong>
                  New student account created
                </strong>

                <span>
                  Student account activity
                </span>

              </div>

              <time>
                Recent
              </time>

            </div>


            {/* TEACHER */}

            <div className="activity-item">

              <div className="activity-avatar teacher">
                T
              </div>

              <div className="activity-details">

                <strong>
                  New teacher account created
                </strong>

                <span>
                  Faculty account activity
                </span>

              </div>

              <time>
                Recent
              </time>

            </div>


            {/* REPORT */}

            <div className="activity-item">

              <div className="activity-avatar analytics">
                ↗
              </div>

              <div className="activity-details">

                <strong>
                  Academic report activity
                </strong>

                <span>
                  Institution performance information
                </span>

              </div>

              <time>
                Recent
              </time>

            </div>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="admin-footer">

          <span>
            Academic Intelligence
          </span>

          <span>
            Institution Management System
          </span>

        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;