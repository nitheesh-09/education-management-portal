import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

type UserRole = "student" | "teacher" | "admin";

function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] =
    useState<UserRole>("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*
      Backend integration will be added later.

      The selected role will be sent to FastAPI
      along with the login credentials.
    */

    console.log({
      role: selectedRole,
      email,
      password,
      rememberMe,
    });

    // Temporary navigation for testing only.
    // We will replace this when FastAPI authentication
    // is connected.

    if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  const handleForgotPassword = () => {
    alert(
      "Please contact your institution administrator to reset your password."
    );
  };

  return (
    <main className="login-page">

      <section className="login-container">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="login-header">

          <p className="login-eyebrow">
            Academic Intelligence
          </p>

          <h1 className="login-title">
            Welcome back.
          </h1>

          <p className="login-subtitle">
            Sign in to access your academic intelligence
            dashboard.
          </p>

        </div>


        {/* =========================================
            ROLE SELECTION
        ========================================== */}

        <div className="role-section">

          <p className="role-heading">
            Continue as
          </p>

          <div className="role-grid">

            {/* STUDENT */}

            <button
              type="button"
              className={`role-card ${
                selectedRole === "student"
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedRole("student")}
            >

              <div className="role-icon">
                S
              </div>

              <div className="role-content">

                <span className="role-title">
                  Student
                </span>

                <span className="role-description">
                  View your academic performance
                </span>

              </div>

              <span className="role-check">
                {selectedRole === "student" ? "✓" : ""}
              </span>

            </button>


            {/* TEACHER */}

            <button
              type="button"
              className={`role-card ${
                selectedRole === "teacher"
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedRole("teacher")}
            >

              <div className="role-icon">
                T
              </div>

              <div className="role-content">

                <span className="role-title">
                  Teacher
                </span>

                <span className="role-description">
                  Monitor and support students
                </span>

              </div>

              <span className="role-check">
                {selectedRole === "teacher" ? "✓" : ""}
              </span>

            </button>


            {/* ADMIN */}

            <button
              type="button"
              className={`role-card ${
                selectedRole === "admin"
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedRole("admin")}
            >

              <div className="role-icon">
                A
              </div>

              <div className="role-content">

                <span className="role-title">
                  Admin
                </span>

                <span className="role-description">
                  Manage your institution
                </span>

              </div>

              <span className="role-check">
                {selectedRole === "admin" ? "✓" : ""}
              </span>

            </button>

          </div>

        </div>


        {/* =========================================
            LOGIN FORM
        ========================================== */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="login-field">

            <label htmlFor="email">
              Email / Institution ID
            </label>

            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email or institution ID"
              autoComplete="username"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <div className="password-label-row">

              <label htmlFor="password">
                Password
              </label>

            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

          </div>


          {/* OPTIONS */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              <span>
                Remember me
              </span>

            </label>


            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>

          </div>


          {/* SIGN IN */}

          <button
            type="submit"
            className="login-button"
          >
            <span>Sign In</span>

            <span className="login-arrow">
              →
            </span>
          </button>


          {/* ACCOUNT INFORMATION */}

          <div className="login-info">

            <div className="login-info-line">
              <span className="info-dot"></span>

              Institution-managed accounts
            </div>

            <p>
              Students and teachers cannot self-register.
              <br />
              Contact your administrator if you need access.
            </p>

          </div>

        </form>

      </section>

    </main>
  );
}

export default Login;