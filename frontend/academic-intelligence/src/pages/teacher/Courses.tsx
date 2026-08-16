import "./Courses.css";

function Courses() {
  return (
    <div className="teacher-courses-page">

      <div className="teacher-courses-header">
        <p className="teacher-courses-eyebrow">
          TEACHER PORTAL
        </p>

        <h1>My Courses</h1>

        <p>
          View the courses assigned to you.
        </p>
      </div>

      <div className="teacher-courses-card">

        <div className="teacher-courses-card-header">
          <h2>Assigned Courses</h2>

          <span>
            Your assigned courses will appear here.
          </span>
        </div>

        <div className="teacher-courses-empty">

          <div className="teacher-courses-empty-icon">
            C
          </div>

          <h3>No courses available</h3>

          <p>
            Courses assigned to you will appear here
            once they are created and assigned by the administrator.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Courses;