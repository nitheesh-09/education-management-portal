import "./StudentProfile.css";

function StudentProfile() {
  return (
    <div className="student-profile-page">

      <div className="student-profile-header">
        <div>
          <p className="student-profile-eyebrow">
            STUDENT PORTAL
          </p>

          <h1>Profile</h1>

          <p>
            View your academic account information.
          </p>
        </div>
      </div>


      <div className="student-profile-card">

        <div className="student-profile-card-header">
          <div>
            <h2>Personal Information</h2>

            <span>
              Your account information will appear here.
            </span>
          </div>
        </div>


        <div className="student-profile-empty">

          <div className="student-profile-empty-icon">
            P
          </div>

          <h3>
            Profile information unavailable
          </h3>

          <p>
            Your profile information will appear here
            once your account has been created by the administrator.
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentProfile;