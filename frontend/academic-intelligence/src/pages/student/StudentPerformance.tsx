import "./StudentPerformance.css";

function StudentPerformance() {
  return (
    <div className="student-performance-page">

      <div className="student-performance-header">
        <div>
          <p className="student-performance-eyebrow">
            STUDENT PORTAL
          </p>

          <h1>Performance</h1>

          <p>
            View your academic marks and performance.
          </p>
        </div>
      </div>


      <div className="student-performance-card">

        <div className="student-performance-card-header">
          <div>
            <h2>Academic Performance</h2>

            <span>
              Your marks and performance records will appear here.
            </span>
          </div>
        </div>


        <div className="student-performance-empty">

          <div className="student-performance-empty-icon">
            %
          </div>

          <h3>
            No performance data available
          </h3>

          <p>
            Your marks and academic performance will appear
            here once they are recorded.
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentPerformance;