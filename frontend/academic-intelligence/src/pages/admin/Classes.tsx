import "./Classes.css";

function Classes() {
  return (
    <div className="classes-page">

      <div className="classes-header">
        <div>
          <p className="classes-eyebrow">
            ACADEMIC MANAGEMENT
          </p>

          <h1>Classes</h1>

          <p className="classes-description">
            Create and manage academic classes.
          </p>
        </div>

        <button className="add-class-btn">
          + Add Class
        </button>
      </div>


      <div className="classes-card">

        <div className="classes-table-header">
          <span>Class</span>
          <span>Course</span>
          <span>Teacher</span>
          <span>Actions</span>
        </div>


        <div className="empty-classes">

          <div className="empty-class-icon">
            ▦
          </div>

          <h3>
            No classes added yet
          </h3>

          <p>
            Classes created by the administrator
            will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Classes;