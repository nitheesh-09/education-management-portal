import "./Performance.css";

function Performance() {
  return (
    <div className="teacher-performance-page">

      <div className="teacher-performance-header">
        <p className="teacher-performance-eyebrow">
          TEACHER PORTAL
        </p>

        <h1>Performance</h1>

        <p>
          Manage and view student academic performance.
        </p>
      </div>

      <div className="teacher-performance-card">

        <div className="teacher-performance-card-header">
          <div>
            <h2>Student Performance</h2>

            <span>
              Student marks and performance records will appear here.
            </span>
          </div>
        </div>

        <div className="teacher-performance-empty">

          <div className="teacher-performance-empty-icon">
            %
          </div>

          <h3>
            No performance records available
          </h3>

          <p>
            Student performance records will appear here once
            marks are added.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Performance;