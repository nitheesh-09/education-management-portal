import "./Profile.css";

function Profile() {
  return (
    <div className="teacher-profile-page">

      <div className="teacher-profile-header">
        <p className="teacher-profile-eyebrow">
          TEACHER PORTAL
        </p>

        <h1>Profile</h1>

        <p>
          View your academic account information.
        </p>
      </div>

      <div className="teacher-profile-card">

        <div className="teacher-profile-card-header">
          <div>
            <h2>Personal Information</h2>

            <span>
              Your account information will appear here.
            </span>
          </div>
        </div>

        <div className="teacher-profile-empty">

          <div className="teacher-profile-empty-icon">
            P
          </div>

          <h3>
            Profile information unavailable
          </h3>

          <p>
            Your profile information will appear here once
            your account has been created.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Profile;