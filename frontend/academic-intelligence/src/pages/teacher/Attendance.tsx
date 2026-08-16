import "./Attendance.css";

function Attendance() {
  return (
    <div className="teacher-attendance-page">

      <div className="teacher-attendance-header">
        <p className="teacher-attendance-eyebrow">
          TEACHER PORTAL
        </p>

        <h1>Attendance</h1>

        <p>
          Manage and view attendance for your students.
        </p>
      </div>


      <div className="teacher-attendance-card">

        <div className="teacher-attendance-card-header">
          <div>
            <h2>Attendance Records</h2>

            <span>
              Student attendance records will appear here.
            </span>
          </div>
        </div>


        <div className="teacher-attendance-empty">

          <div className="teacher-attendance-empty-icon">
            ✓
          </div>

          <h3>
            No attendance records available
          </h3>

          <p>
            Attendance records will appear here once
            students are assigned and attendance is recorded.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Attendance;