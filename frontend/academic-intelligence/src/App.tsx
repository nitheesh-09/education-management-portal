import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Courses from "./pages/admin/Courses";
import Classes from "./pages/admin/Classes";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentClasses from "./pages/student/StudentClasses";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherStudents from "./pages/teacher/Students";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherPerformance from "./pages/teacher/Performance";
import TeacherProfile from "./pages/teacher/Profile";
import Analytics from "./pages/admin/Analytics";
import AIInsights from "./AIInsights";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC PAGES ================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/students"
          element={<Students />}
        />
        <Route
  path="/admin/teachers"
  element={<Teachers />}
/>
<Route
  path="/admin/courses"
  element={<Courses />}
/>
<Route
  path="/admin/classes"
  element={<Classes />}
/>
<Route
  path="/student"
  element={<StudentDashboard />}
/>
<Route
  path="/student/courses"
  element={<StudentCourses />}
/>
<Route
  path="/student/classes"
  element={<StudentClasses />}
/>
<Route
  path="/student/attendance"
  element={<StudentAttendance />}
/>
<Route
  path="/student/performance"
  element={<StudentPerformance />}
/>
<Route
  path="/student/profile"
  element={<StudentProfile />}
/>
<Route
  path="/teacher"
  element={<TeacherDashboard />}
/>
<Route
  path="/teacher/courses"
  element={<TeacherCourses />}
/>
<Route
  path="/teacher/classes"
  element={<TeacherClasses />}
/>
<Route
  path="/teacher/students"
  element={<TeacherStudents />}
/>
<Route
  path="/teacher/attendance"
  element={<TeacherAttendance />}
/>
<Route
  path="/teacher/performance"
  element={<TeacherPerformance />}
/>
<Route
  path="/teacher/profile"
  element={<TeacherProfile />}
/>
<Route
  path="/admin/analytics"
  element={<Analytics />}
/>
<Route
  path="/admin/ai-insights"
  element={<AIInsights />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;