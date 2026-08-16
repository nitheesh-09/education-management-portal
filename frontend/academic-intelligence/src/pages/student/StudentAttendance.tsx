import "./StudentAttendance.css";

function StudentAttendance() {
  return (
    <div className="student-attendance-page">

      <div className="student-attendance-header">
        <div>
          <p className="student-attendance-eyebrow">
            STUDENT PORTAL
          </p>

          <h1>Attendance</h1>

          <p>
            View your attendance records and attendance status.
          </p>
        </div>
      </div>


      <div className="student-attendance-card">

        <div className="student-attendance-card-header">
          <div>
            <h2>Attendance Records</h2>

            <span>
              Your attendance information will appear here.
            </span>
          </div>
        </div>


        <div className="student-attendance-empty">

          <div className="student-attendance-empty-icon">
            ✓
          </div>

          <h3>
            No attendance records available
          </h3>

          <p>
            Attendance records will appear here once
            your teachers begin recording attendance.
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentAttendance;