import "./StudentClasses.css";

function StudentClasses() {
  return (
    <div className="student-classes-page">

      <div className="student-classes-header">
        <div>
          <p className="student-classes-eyebrow">
            STUDENT PORTAL
          </p>

          <h1>My Classes</h1>

          <p>
            View your assigned classes and schedule.
          </p>
        </div>
      </div>


      <div className="student-classes-card">

        <div className="student-classes-card-header">
          <div>
            <h2>Class Schedule</h2>

            <span>
              Your scheduled classes will appear here.
            </span>
          </div>
        </div>


        <div className="student-classes-empty">

          <div className="student-classes-empty-icon">
            ▦
          </div>

          <h3>
            No classes scheduled
          </h3>

          <p>
            Your classes and timetable will appear here
            once they are assigned to your account.
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentClasses;