import { useState } from "react";
import "./Courses.css";
 
interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
  status: "Active" | "Inactive";
}
 
function Courses() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [showModal, setShowModal] = useState(false);
 
  // Seeded with KIT - KalaignarKarunanidhi Institute of Technology's
  // real academic programs (https://kitcbe.com/) — UG, PG & Research.
  const [courses] = useState<Course[]>([
    // ================= UNDERGRADUATE (UG) =================
    {
      id: 1,
      code: "AERO",
      name: "B.E. Aeronautical Engineering",
      department: "Aeronautical Engineering",
      credits: 4,
      status: "Active",
    },
    {
      id: 2,
      code: "AGRI",
      name: "B.Tech. Agricultural Engineering",
      department: "Agricultural Engineering",
      credits: 4,
      status: "Active",
    },
    {
      id: 3,
      code: "AIDS",
      name: "B.Tech. Artificial Intelligence & Data Science",
      department: "Artificial Intelligence & Data Science",
      credits: 4,
      status: "Active",
    },
    {
      id: 4,
      code: "BME",
      name: "B.E. Biomedical Engineering",
      department: "Biomedical Engineering",
      credits: 4,
      status: "Active",
    },
    {
      id: 5,
      code: "BT",
      name: "B.Tech. Biotechnology",
      department: "Biotechnology",
      credits: 4,
      status: "Active",
    },
    {
      id: 6,
      code: "CSBS",
      name: "B.Tech. Computer Science & Business Systems",
      department: "Computer Science & Business Systems",
      credits: 4,
      status: "Active",
    },
    {
      id: 7,
      code: "CSE",
      name: "B.E. Computer Science & Engineering",
      department: "Computer Science & Engineering",
      credits: 4,
      status: "Active",
    },
    {
      id: 8,
      code: "CSE-AIML",
      name: "B.E. CSE (Artificial Intelligence & Machine Learning)",
      department: "CSE (Artificial Intelligence & Machine Learning)",
      credits: 4,
      status: "Active",
    },
    {
      id: 9,
      code: "CSE-CS",
      name: "B.E. Computer Science and Engineering (Cyber Security)",
      department: "CSE (Cyber Security)",
      credits: 4,
      status: "Active",
    },
    {
      id: 10,
      code: "ECE",
      name: "B.E. Electronics & Communication Engineering",
      department: "Electronics & Communication Engineering",
      credits: 4,
      status: "Active",
    },
    {
      id: 11,
      code: "VLSI",
      name: "B.E. Electronics Engineering (VLSI Design and Technology)",
      department: "Electronics Engineering (VLSI Design and Technology)",
      credits: 4,
      status: "Active",
    },
    {
      id: 12,
      code: "EEE",
      name: "B.E. Electrical & Electronics Engineering",
      department: "Electrical & Electronics Engineering",
      credits: 4,
      status: "Active",
    },
    {
      id: 13,
      code: "MECH",
      name: "B.E. Mechanical Engineering",
      department: "Mechanical Engineering",
      credits: 4,
      status: "Active",
    },
 
    // ================= POSTGRADUATE (PG) =================
    {
      id: 14,
      code: "ME-AE",
      name: "M.E. Applied Electronics",
      department: "Electronics & Communication Engineering",
      credits: 3,
      status: "Active",
    },
    {
      id: 15,
      code: "ME-CSE",
      name: "M.E. Computer Science and Engineering",
      department: "Computer Science & Engineering",
      credits: 3,
      status: "Active",
    },
    {
      id: 16,
      code: "ME-PS",
      name: "M.E. Power Systems Engineering",
      department: "Electrical & Electronics Engineering",
      credits: 3,
      status: "Active",
    },
    {
      id: 17,
      code: "ME-ED",
      name: "M.E. Engineering Design",
      department: "Mechanical Engineering",
      credits: 3,
      status: "Active",
    },
    {
      id: 18,
      code: "ME-VLSI",
      name: "M.E. VLSI Design",
      department: "Electronics Engineering (VLSI Design and Technology)",
      credits: 3,
      status: "Active",
    },
    {
      id: 19,
      code: "MBA",
      name: "MBA",
      department: "MBA",
      credits: 3,
      status: "Active",
    },
    {
      id: 20,
      code: "MCA",
      name: "MCA",
      department: "MCA",
      credits: 3,
      status: "Active",
    },
 
    // ================= RESEARCH PROGRAMMES =================
    {
      id: 21,
      code: "PHD-CSE",
      name: "Ph.D. in CSE",
      department: "Computer Science & Engineering",
      credits: 2,
      status: "Active",
    },
    {
      id: 22,
      code: "PHD-AIDS",
      name: "Ph.D. in AI & DS",
      department: "Artificial Intelligence & Data Science",
      credits: 2,
      status: "Active",
    },
    {
      id: 23,
      code: "PHD-ECE",
      name: "Ph.D. in ECE",
      department: "Electronics & Communication Engineering",
      credits: 2,
      status: "Active",
    },
    {
      id: 24,
      code: "PHD-EEE",
      name: "Ph.D. in EEE",
      department: "Electrical & Electronics Engineering",
      credits: 2,
      status: "Active",
    },
    {
      id: 25,
      code: "PHD-MECH",
      name: "Ph.D. in Mech",
      department: "Mechanical Engineering",
      credits: 2,
      status: "Active",
    },
  ]);
 
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());
 
    const matchesDepartment =
      department === "All Departments" ||
      course.department === department;
 
    return matchesSearch && matchesDepartment;
  });
 
  return (
    <div className="courses-page">
 
      {/* ================= HEADER ================= */}
 
      <section className="courses-header">
 
        <div>
          <span className="courses-eyebrow">
            ACADEMIC MANAGEMENT
          </span>
 
          <h1>Courses</h1>
 
          <p>
            Create and manage the academic courses offered
            by the institution.
          </p>
        </div>
 
        <button
          className="add-course-button"
          onClick={() => setShowModal(true)}
        >
          <span>+</span>
          Add Course
        </button>
 
      </section>
 
 
      {/* ================= SUMMARY ================= */}
 
      <section className="courses-summary">
 
        <div className="summary-card">
 
          <span className="summary-label">
            TOTAL COURSES
          </span>
 
          <strong>
            {courses.length}
          </strong>
 
          <small>
            Currently registered
          </small>
 
        </div>
 
 
        <div className="summary-card">
 
          <span className="summary-label">
            ACTIVE COURSES
          </span>
 
          <strong>
            {
              courses.filter(
                (course) => course.status === "Active"
              ).length
            }
          </strong>
 
          <small>
            Available courses
          </small>
 
        </div>
 
 
        <div className="summary-card">
 
          <span className="summary-label">
            DEPARTMENTS
          </span>
 
          <strong>
            {
              new Set(
                courses.map(
                  (course) => course.department
                )
              ).size
            }
          </strong>
 
          <small>
            Departments with courses
          </small>
 
        </div>
 
      </section>
 
 
      {/* ================= TABLE PANEL ================= */}
 
      <section className="courses-panel">
 
        <div className="courses-filter-bar">
 
          {/* Search */}
 
          <div className="course-search">
 
            <span>⌕</span>
 
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
 
          </div>
 
 
          {/* Department */}
 
          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
          >
 
            <option>
              All Departments
            </option>
 
            <option>
              Aeronautical Engineering
            </option>
 
            <option>
              Agricultural Engineering
            </option>
 
            <option>
              Artificial Intelligence & Data Science
            </option>
 
            <option>
              Biomedical Engineering
            </option>
 
            <option>
              Biotechnology
            </option>
 
            <option>
              Computer Science & Business Systems
            </option>
 
            <option>
              Computer Science & Engineering
            </option>
 
            <option>
              CSE (Artificial Intelligence & Machine Learning)
            </option>
 
            <option>
              CSE (Cyber Security)
            </option>
 
            <option>
              Electronics & Communication Engineering
            </option>
 
            <option>
              Electronics Engineering (VLSI Design and Technology)
            </option>
 
            <option>
              Electrical & Electronics Engineering
            </option>
 
            <option>
              Mechanical Engineering
            </option>
 
            <option>
              MBA
            </option>
 
            <option>
              MCA
            </option>
 
          </select>
 
        </div>
 
 
        {/* ================= TABLE ================= */}
 
        <div className="courses-table-wrapper">
 
          <table className="courses-table">
 
            <thead>
 
              <tr>
 
                <th>COURSE</th>
 
                <th>COURSE CODE</th>
 
                <th>DEPARTMENT</th>
 
                <th>CREDITS</th>
 
                <th>STATUS</th>
 
                <th>ACTIONS</th>
 
              </tr>
 
            </thead>
 
 
            <tbody>
 
              {filteredCourses.length === 0 ? (
 
                <tr>
 
                  <td
                    colSpan={6}
                    className="empty-courses"
                  >
 
                    <div className="empty-course-icon">
                      C
                    </div>
 
                    <h3>
                      No courses yet
                    </h3>
 
                    <p>
                      Courses created by the administrator
                      will appear here.
                    </p>
 
                    <button
                      onClick={() =>
                        setShowModal(true)
                      }
                    >
                      + Add Course
                    </button>
 
                  </td>
 
                </tr>
 
              ) : (
 
                filteredCourses.map((course) => (
 
                  <tr key={course.id}>
 
                    <td>
 
                      <div className="course-name-cell">
 
                        <div className="course-avatar">
                          {course.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
 
                        <div>
 
                          <strong>
                            {course.name}
                          </strong>
 
                          <span>
                            {course.code}
                          </span>
 
                        </div>
 
                      </div>
 
                    </td>
 
 
                    <td>
                      {course.code}
                    </td>
 
 
                    <td>
                      {course.department}
                    </td>
 
 
                    <td>
                      {course.credits}
                    </td>
 
 
                    <td>
 
                      <span
                        className={`course-status ${
                          course.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {course.status}
                      </span>
 
                    </td>
 
 
                    <td>
 
                      <div className="course-actions">
 
                        <button>
                          View
                        </button>
 
                        <button>
                          Edit
                        </button>
 
                        <button className="delete-course">
                          Delete
                        </button>
 
                      </div>
 
                    </td>
 
                  </tr>
 
                ))
 
              )}
 
            </tbody>
 
          </table>
 
        </div>
 
 
        {/* ================= FOOTER ================= */}
 
        <div className="courses-table-footer">
 
          Showing{" "}
 
          <strong>
            {filteredCourses.length}
          </strong>{" "}
 
          course
          {filteredCourses.length !== 1
            ? "s"
            : ""}
 
        </div>
 
      </section>
 
 
      {/* ================= ADD COURSE MODAL ================= */}
 
      {showModal && (
 
        <div className="course-modal-overlay">
 
          <div className="course-modal">
 
            <div className="course-modal-header">
 
              <div>
 
                <span>
                  ACADEMIC MANAGEMENT
                </span>
 
                <h2>
                  Add Course
                </h2>
 
                <p>
                  Create a new academic course.
                </p>
 
              </div>
 
              <button
                className="course-modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>
 
            </div>
 
 
            <div className="course-form">
 
              <div className="course-form-field">
 
                <label>
                  Course Name
                </label>
 
                <input
                  type="text"
                  placeholder="Enter course name"
                />
 
              </div>
 
 
              <div className="course-form-row">
 
                <div className="course-form-field">
 
                  <label>
                    Course Code
                  </label>
 
                  <input
                    type="text"
                    placeholder="Enter course code"
                  />
 
                </div>
 
 
                <div className="course-form-field">
 
                  <label>
                    Credits
                  </label>
 
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Credits"
                  />
 
                </div>
 
              </div>
 
 
              <div className="course-form-field">
 
                <label>
                  Department
                </label>
 
                <select>
 
                  <option value="">
                    Select department
                  </option>
 
                  <option>
                    Aeronautical Engineering
                  </option>
 
                  <option>
                    Agricultural Engineering
                  </option>
 
                  <option>
                    Artificial Intelligence & Data Science
                  </option>
 
                  <option>
                    Biomedical Engineering
                  </option>
 
                  <option>
                    Biotechnology
                  </option>
 
                  <option>
                    Computer Science & Business Systems
                  </option>
 
                  <option>
                    Computer Science & Engineering
                  </option>
 
                  <option>
                    CSE (Artificial Intelligence & Machine Learning)
                  </option>
 
                  <option>
                    CSE (Cyber Security)
                  </option>
 
                  <option>
                    Electronics & Communication Engineering
                  </option>
 
                  <option>
                    Electronics Engineering (VLSI Design and Technology)
                  </option>
 
                  <option>
                    Electrical & Electronics Engineering
                  </option>
 
                  <option>
                    Mechanical Engineering
                  </option>
 
                  <option>
                    MBA
                  </option>
 
                  <option>
                    MCA
                  </option>
 
                </select>
 
              </div>
 
 
              <div className="course-modal-note">
 
                Course information will be stored
                through the institution's backend
                once the API integration is connected.
 
              </div>
 
 
              <div className="course-modal-actions">
 
                <button
                  className="course-cancel-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>
 
                <button
                  className="course-create-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Create Course
                </button>
 
              </div>
 
            </div>
 
          </div>
 
        </div>
 
      )}
 
    </div>
  );
}
 
export default Courses;