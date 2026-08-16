function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-mark">A</span>
        <span>Academic Intelligence</span>
      </div>

      <div className="nav-links">
        <a href="#platform">Platform</a>
        <a href="#how-it-works">How it works</a>
        <a href="#insights">AI Insights</a>
      </div>

      <div className="nav-actions">
        <a href="/login" className="login-link">
          Login
        </a>

        <a href="/register" className="nav-button">
          Get Started
        </a>
      </div>
    </nav>
  );
}

export default Navbar;