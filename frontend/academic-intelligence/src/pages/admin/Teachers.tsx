import { useState } from "react";
import "./Teachers.css";

interface Teacher {
  id: number;
  name: string;
  email: string;
  department: string;
  subject: string;
  status: "Active" | "Inactive";
}

function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    subject: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();

    const newTeacher: Teacher = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      subject: formData.subject,
      status: "Active",
    };

    setTeachers([...teachers, newTeacher]);

    setFormData({
      name: "",
      email: "",
      department: "",
      subject: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

  return (
    <div className="teachers-page">

      <div className="teachers-header">
        <div>
          <p className="teachers-eyebrow">ADMINISTRATION</p>
          <h1>Teachers</h1>
          <p className="teachers-description">
            Manage institution teachers and their academic information.
          </p>
        </div>

        <button
          className="add-teacher-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Teacher
        </button>
      </div>

      {showForm && (
        <div className="teacher-form-card">

          <div className="form-heading">
            <h2>Add Teacher</h2>
            <p>Create a teacher account through the institution.</p>
          </div>

          <form onSubmit={handleAddTeacher}>

            <div className="form-grid">

              <div className="form-group">
                <label>Teacher Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter teacher name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter institutional email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                />
              </div>

            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="save-teacher-btn">
                Add Teacher
              </button>
            </div>

          </form>
        </div>
      )}

      <div className="teachers-card">

        <div className="teachers-card-header">
          <div>
            <h2>Teacher Directory</h2>
            <p>
              {teachers.length} teacher
              {teachers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {teachers.length === 0 ? (
          <div className="empty-teachers">
            <div className="empty-icon">+</div>

            <h3>No teachers added yet</h3>

            <p>
              Teachers created by the administrator will appear here.
            </p>
          </div>
        ) : (
          <div className="teacher-table-wrapper">

            <table className="teacher-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {teachers.map((teacher) => (
                  <tr key={teacher.id}>

                    <td className="teacher-name">
                      {teacher.name}
                    </td>

                    <td>{teacher.email}</td>

                    <td>{teacher.department}</td>

                    <td>{teacher.subject}</td>

                    <td>
                      <span className="status-badge">
                        {teacher.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-teacher-btn"
                        onClick={() => handleDelete(teacher.id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Teachers;