import "./StudentCourses.css";

function StudentCourses() {
  return (
    <div className="student-courses-page">

      <div className="student-courses-header">
        <div>
          <p className="student-courses-eyebrow">
            STUDENT PORTAL
          </p>

          <h1>My Courses</h1>

          <p>
            View the courses assigned to your account.
          </p>
        </div>
      </div>


      <div className="student-courses-card">

        <div className="student-courses-card-header">
          <div>
            <h2>Enrolled Courses</h2>
            <span>Your assigned courses will appear here.</span>
          </div>
        </div>


        <div className="student-courses-empty">

          <div className="student-courses-empty-icon">
            C
          </div>

          <h3>No courses available</h3>

          <p>
            Courses assigned by your administrator
            will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentCourses;