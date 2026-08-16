import "./Analytics.css";

function Analytics() {
  return (
    <div className="admin-analytics-page">

      <div className="admin-analytics-header">
        <p className="admin-analytics-eyebrow">
          ADMIN PORTAL
        </p>

        <h1>Analytics</h1>

        <p>
          Monitor academic and administrative statistics.
        </p>
      </div>

      <div className="admin-analytics-grid">

        <div className="admin-analytics-card">
          <span>Students</span>
          <strong>—</strong>
          <small>Data will appear here</small>
        </div>

        <div className="admin-analytics-card">
          <span>Teachers</span>
          <strong>—</strong>
          <small>Data will appear here</small>
        </div>

        <div className="admin-analytics-card">
          <span>Courses</span>
          <strong>—</strong>
          <small>Data will appear here</small>
        </div>

        <div className="admin-analytics-card">
          <span>Classes</span>
          <strong>—</strong>
          <small>Data will appear here</small>
        </div>

      </div>

      <div className="admin-analytics-panel">

        <h2>Academic Overview</h2>

        <p>
          Academic statistics and trends will appear here
          once data is available.
        </p>

        <div className="admin-analytics-empty">
          No analytics data available
        </div>

      </div>

    </div>
  );
}

export default Analytics;