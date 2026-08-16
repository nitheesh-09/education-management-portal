import "./Classes.css";

function Classes() {
  return (
    <div className="teacher-classes-page">

      <div className="teacher-classes-header">
        <p className="teacher-classes-eyebrow">
          TEACHER PORTAL
        </p>

        <h1>My Classes</h1>

        <p>
          View the classes assigned to you.
        </p>
      </div>

      <div className="teacher-classes-card">

        <div className="teacher-classes-card-header">
          <h2>Assigned Classes</h2>

          <span>
            Your class schedule will appear here.
          </span>
        </div>

        <div className="teacher-classes-empty">

          <div className="teacher-classes-empty-icon">
            ▦
          </div>

          <h3>No classes available</h3>

          <p>
            Classes assigned to you will appear here
            once they are created and assigned.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Classes;