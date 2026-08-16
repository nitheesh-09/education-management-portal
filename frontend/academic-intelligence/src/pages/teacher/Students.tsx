import "./Students.css";

function Students() {
  return (
    <div className="teacher-students-page">

      <div className="teacher-students-header">
        <p className="teacher-students-eyebrow">
          TEACHER PORTAL
        </p>

        <h1>Students</h1>

        <p>
          View students assigned to your classes.
        </p>
      </div>


      <div className="teacher-students-card">

        <div className="teacher-students-card-header">
          <div>
            <h2>My Students</h2>

            <span>
              Students assigned to your classes will appear here.
            </span>
          </div>
        </div>


        <div className="teacher-students-empty">

          <div className="teacher-students-empty-icon">
            S
          </div>

          <h3>
            No students available
          </h3>

          <p>
            Students will appear here once they are
            assigned to your classes.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Students;