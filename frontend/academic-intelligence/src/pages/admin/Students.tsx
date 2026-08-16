import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Students.css";

type Student = {
  id: number;
  name: string;
  studentId: string;
  email: string;
  department: string;
  year: string;
  phone: string;
  status: "Active" | "Inactive";
};

const Students = () => {
  const navigate = useNavigate();

  // Empty initially.
  // Later this will be populated from FastAPI.
  const [students, setStudents] = useState<Student[]>([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All Departments");
  const [year, setYear] =
    useState("All Years");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "",
    year: "",
    phone: "",
    password: "",
  });

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      student.studentId
        .toLowerCase()
        .includes(searchText) ||
      student.email
        .toLowerCase()
        .includes(searchText);

    const matchesDepartment =
      department === "All Departments" ||
      student.department === department;

    const matchesYear =
      year === "All Years" ||
      student.year === year;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesYear
    );
  });

  /*
   * TEMPORARY FRONTEND FUNCTION
   *
   * This will later be replaced with:
   * POST /api/admin/students
   *
   * The real student will be stored in PostgreSQL.
   */
  const handleCreateStudent = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const newStudent: Student = {
      id: Date.now(),
      name: form.name,
      studentId: form.studentId,
      email: form.email,
      department: form.department,
      year: form.year,
      phone: form.phone,
      status: "Active",
    };

    setStudents((current) => [
      ...current,
      newStudent,
    ]);

    setForm({
      name: "",
      studentId: "",
      email: "",
      department: "",
      year: "",
      phone: "",
      password: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setStudents((current) =>
      current.filter(
        (student) => student.id !== id
      )
    );
  };

  const openDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  return (
    <div className="students-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="students-sidebar">

        <div className="students-brand">
          <div className="students-brand-logo">
            AI
          </div>

          <div>
            <h2>Academic</h2>
            <span>Intelligence</span>
          </div>
        </div>

        <nav className="students-navigation">

          <p className="students-nav-label">
            MANAGEMENT
          </p>

          <button
            className="students-nav-item"
            onClick={() =>
              navigate("/admin")
            }
          >
            <span className="students-nav-icon">
              ⌂
            </span>
            Overview
          </button>

          <button
            className="students-nav-item active"
          >
            <span className="students-nav-icon">
              S
            </span>
            Students
          </button>

          <button
            className="students-nav-item"
            onClick={() =>
              navigate("/admin/teachers")
            }
          >
            <span className="students-nav-icon">
              T
            </span>
            Teachers
          </button>

          <button className="students-nav-item">
            <span className="students-nav-icon">
              C
            </span>
            Courses
          </button>

          <button className="students-nav-item">
            <span className="students-nav-icon">
              ▦
            </span>
            Classes
          </button>

          <button className="students-nav-item">
            <span className="students-nav-icon">
              ↗
            </span>
            Analytics
          </button>

          <button className="students-nav-item">
            <span className="students-nav-icon">
              ✦
            </span>
            AI Insights
          </button>

          <button className="students-nav-item">
            <span className="students-nav-icon">
              ▤
            </span>
            Reports
          </button>

        </nav>

        <div className="students-sidebar-bottom">

          <div className="students-user">

            <div className="students-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Institution Admin</span>
            </div>

          </div>

          <button
            className="students-logout"
            onClick={() =>
              navigate("/login")
            }
          >
            ↪ &nbsp; Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="students-main">

        <header className="students-header">

          <div>

            <button
              className="students-back"
              onClick={() =>
                navigate("/admin")
              }
            >
              ← Dashboard
            </button>

            <p className="students-label">
              STUDENT MANAGEMENT
            </p>

            <h1>Students</h1>

            <p className="students-subtitle">
              Create and manage student accounts
              across the institution.
            </p>

          </div>

          <button
            className="add-student-button"
            onClick={() =>
              setShowModal(true)
            }
          >
            <span>+</span>
            Add Student
          </button>

        </header>


        {/* ================= SUMMARY ================= */}

        <section className="student-summary">

          <div className="summary-card">
            <span>Total Students</span>
            <strong>
              {students.length}
            </strong>
          </div>

          <div className="summary-card">
            <span>Active Students</span>
            <strong>
              {
                students.filter(
                  (student) =>
                    student.status === "Active"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Inactive Students</span>
            <strong>
              {
                students.filter(
                  (student) =>
                    student.status === "Inactive"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Filtered Results</span>
            <strong>
              {filteredStudents.length}
            </strong>
          </div>

        </section>


        {/* ================= TABLE ================= */}

        <section className="students-panel">

          <div className="students-filter-bar">

            <div className="student-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by name, ID or email..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(
                  event.target.value
                )
              }
            >
              <option>
                All Departments
              </option>

              <option>
                Computer Science
              </option>

              <option>
                Cybersecurity
              </option>

              <option>
                AI & Data Science
              </option>

              <option>
                Information Technology
              </option>
            </select>

            <select
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
            >
              <option>
                All Years
              </option>

              <option>I Year</option>
              <option>II Year</option>
              <option>III Year</option>
              <option>IV Year</option>
            </select>

          </div>


          <div className="students-table-wrapper">

            <table className="students-table">

              <thead>

                <tr>
                  <th>STUDENT</th>
                  <th>STUDENT ID</th>
                  <th>DEPARTMENT</th>
                  <th>YEAR</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {filteredStudents.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="empty-students"
                    >

                      <div className="empty-icon">
                        S
                      </div>

                      <h3>
                        No students yet
                      </h3>

                      <p>
                        Student accounts created
                        by the administrator will
                        appear here.
                      </p>

                      <button
                        onClick={() =>
                          setShowModal(true)
                        }
                      >
                        + Add Student
                      </button>

                    </td>

                  </tr>

                ) : (

                  filteredStudents.map(
                    (student) => (

                      <tr key={student.id}>

                        <td>

                          <div className="student-name-cell">

                            <div className="student-table-avatar">
                              {student.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {student.name}
                              </strong>

                              <span>
                                {student.email}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          {student.studentId}
                        </td>

                        <td>
                          {student.department}
                        </td>

                        <td>
                          {student.year}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              student.status ===
                              "Active"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {student.status}
                          </span>

                        </td>

                        <td>

                          <div className="student-actions">

                            <button
                              onClick={() =>
                                openDetails(student)
                              }
                            >
                              View
                            </button>

                            <button
                              className="delete-action"
                              onClick={() =>
                                handleDelete(
                                  student.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>


          <div className="students-table-footer">

            Showing{" "}
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            student
            {filteredStudents.length !== 1
              ? "s"
              : ""}

          </div>

        </section>

      </main>


      {/* ================= ADD STUDENT MODAL ================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={() =>
            setShowModal(false)
          }
        >

          <div
            className="student-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <p>
                  ACCOUNT MANAGEMENT
                </p>

                <h2>
                  Add Student
                </h2>

                <span>
                  Create a student account.
                </span>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleCreateStudent}
            >

              <div className="form-grid">

                <div className="form-field full">

                  <label>
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    value={form.name}
                    placeholder="Enter full name"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name:
                          event.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-field">

                  <label>
                    Student ID
                  </label>

                  <input
                    required
                    type="text"
                    value={form.studentId}
                    placeholder="Student ID"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        studentId:
                          event.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-field">

                  <label>
                    Email
                  </label>

                  <input
                    required
                    type="email"
                    value={form.email}
                    placeholder="Student email"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email:
                          event.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-field">

                  <label>
                    Department
                  </label>

                  <select
                    required
                    value={form.department}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        department:
                          event.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select Department
                    </option>

                    <option>
                      Computer Science
                    </option>

                    <option>
                      Cybersecurity
                    </option>

                    <option>
                      AI & Data Science
                    </option>

                    <option>
                      Information Technology
                    </option>

                  </select>

                </div>


                <div className="form-field">

                  <label>
                    Year
                  </label>

                  <select
                    required
                    value={form.year}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        year:
                          event.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select Year
                    </option>

                    <option>
                      I Year
                    </option>

                    <option>
                      II Year
                    </option>

                    <option>
                      III Year
                    </option>

                    <option>
                      IV Year
                    </option>

                  </select>

                </div>


                <div className="form-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    placeholder="Phone number"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        phone:
                          event.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-field">

                  <label>
                    Initial Password
                  </label>

                  <input
                    required
                    type="password"
                    value={form.password}
                    placeholder="Temporary password"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        password:
                          event.target.value,
                      })
                    }
                  />

                </div>

              </div>


              <div className="modal-note">
                The credentials will be provided
                to the student for their first login.
              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-button"
                >
                  Create Student
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ================= DETAILS ================= */}

      {showDetails &&
        selectedStudent && (

          <div
            className="modal-overlay"
            onMouseDown={() =>
              setShowDetails(false)
            }
          >

            <div
              className="details-modal"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              <div className="details-top">

                <div className="large-student-avatar">
                  {selectedStudent.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h2>
                    {selectedStudent.name}
                  </h2>

                  <span>
                    {selectedStudent.studentId}
                  </span>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowDetails(false)
                  }
                >
                  ×
                </button>

              </div>


              <div className="details-grid">

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedStudent.email}
                  </strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>
                    {selectedStudent.department}
                  </strong>
                </div>

                <div>
                  <span>Year</span>
                  <strong>
                    {selectedStudent.year}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedStudent.phone ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {selectedStudent.status}
                  </strong>
                </div>

              </div>

              <button
                className="details-close-button"
                onClick={() =>
                  setShowDetails(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        )}

    </div>
  );
};

export default Students;