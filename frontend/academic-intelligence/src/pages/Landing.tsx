import "../App.css";

import kitLogo from "../assets/kit-logo.png";
import campus1 from "../assets/campus1.png";
import campus2 from "../assets/campus2.png";

import achievement1 from "../assets/acheivement1.png";
import achievement2 from "../assets/acheivement2.png";
import achievement3 from "../assets/acheivement3.png";

function Landing() {
  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-logo">
            <img src={kitLogo} alt="KIT Logo" />
          </div>

          <div className="brand-text">
            <strong>Academic Intelligence</strong>
            <span>Powered for KIT</span>
          </div>

        </div>


        <div className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#workflow">How it works</a>
          <a href="#about">About KIT</a>
        </div>


        <div className="nav-actions">

          <a
            href="/login"
            className="login-link"
          >
            Login
          </a>

          <a
            href="/register"
            className="start-button"
          >
            Get Started
          </a>

        </div>

      </nav>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main>

        {/* ===================================================
            HERO
        =================================================== */}

        <section
          className="hero"
          id="platform"
        >

          <div className="hero-left">

            <div className="eyebrow">
              AI-POWERED ACADEMIC INTELLIGENCE
            </div>


            <h1>
              Understand student
              <br />
              performance <em>before</em>
              <br />
              it becomes a problem.
            </h1>


            <p className="hero-description">
              Transform attendance, assignments, examinations and
              academic performance into early warnings, explainable
              insights and personalized interventions.
            </p>


            <div className="hero-buttons">

              <a
                href="/login"
                className="primary-button"
              >
                Explore Platform
                <span>→</span>
              </a>


              <a
                href="#workflow"
                className="outline-button"
              >
                See how it works
              </a>

            </div>


            <div className="hero-note">

              <span className="pulse"></span>

              Built for the academic ecosystem of KIT

            </div>

          </div>


          {/* HERO IMAGE */}

          <div className="hero-visual">

            <img
              src={campus1}
              alt="KIT Campus"
              className="campus-image"
            />

            <div className="image-overlay"></div>


            {/* HERO DATA CARD */}

            <div className="hero-card">

              <div className="card-top">

                <div>

                  <span>ACADEMIC INTELLIGENCE</span>

                  <h3>
                    Institution Overview
                  </h3>

                </div>


                <div className="live">

                  <i></i>
                  LIVE

                </div>

              </div>


              <div className="mini-stats">

                <div>
                  <span>Students</span>
                  <strong>4K+</strong>
                </div>

                <div>
                  <span>Attendance</span>
                  <strong>91%</strong>
                </div>

                <div>
                  <span>Performance</span>
                  <strong>87%</strong>
                </div>

              </div>


              <div className="ai-signal">

                <div className="signal-icon">
                  ✦
                </div>

                <div>

                  <span>AI SIGNAL</span>

                  <p>
                    Performance decline detected in 3 subjects.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            TRUST BAR
        =================================================== */}

        <section className="trust-section">

          <div className="trust-title">
            KALAIGNARKARUNANIDHI
            <br />
            INSTITUTE OF TECHNOLOGY
          </div>


          <div className="trust-item">

            <strong>4K+</strong>
            <span>Students</span>

          </div>


          <div className="trust-item">

            <strong>94%</strong>
            <span>Placement Support</span>

          </div>


          <div className="trust-item">

            <strong>300+</strong>
            <span>Industry Partnerships</span>

          </div>


          <div className="trust-location">

            COIMBATORE
            <br />
            TAMIL NADU

          </div>

        </section>


        {/* ===================================================
            INTELLIGENCE
        =================================================== */}

        <section
          className="intelligence-section"
          id="intelligence"
        >

          <div className="section-heading">

            <span>THE INTELLIGENCE LAYER</span>

            <h2>
              Academic data already exists.
              <br />
              <em>Now make it intelligent.</em>
            </h2>

            <p>
              Instead of waiting until examination results reveal
              a problem, Academic Intelligence continuously connects
              the signals that already exist inside an institution.
            </p>

          </div>


          <div className="data-flow">

            {/* INPUT */}

            <div className="data-column">

              <div className="data-label">
                INPUT DATA
              </div>


              <div className="data-card">

                <span>01</span>

                <strong>
                  Attendance
                </strong>

                <p>
                  Daily attendance patterns
                </p>

              </div>


              <div className="data-card">

                <span>02</span>

                <strong>
                  Assignments
                </strong>

                <p>
                  Submission and completion
                </p>

              </div>


              <div className="data-card">

                <span>03</span>

                <strong>
                  Examinations
                </strong>

                <p>
                  Marks and assessment results
                </p>

              </div>


              <div className="data-card">

                <span>04</span>

                <strong>
                  Academic History
                </strong>

                <p>
                  Long-term performance trends
                </p>

              </div>

            </div>


            {/* AI ENGINE */}

            <div className="flow-engine">

              <div className="engine-circle">
                <span>✦</span>
              </div>

              <div className="engine-line"></div>

              <strong>
                AI ENGINE
              </strong>

              <p>
                Analyze
                <br />
                Detect
                <br />
                Predict
                <br />
                Recommend
              </p>

            </div>


            {/* OUTPUT */}

            <div className="output-column">

              <div className="data-label">
                INTELLIGENCE OUTPUT
              </div>


              <div className="output-card">

                <div className="output-icon">
                  ↗
                </div>

                <div>

                  <strong>
                    Performance Analysis
                  </strong>

                  <p>
                    Understand academic trends
                  </p>

                </div>

              </div>


              <div className="output-card warning-card">

                <div className="output-icon">
                  !
                </div>

                <div>

                  <strong>
                    At-Risk Detection
                  </strong>

                  <p>
                    Identify students needing attention
                  </p>

                </div>

              </div>


              <div className="output-card">

                <div className="output-icon">
                  ◌
                </div>

                <div>

                  <strong>
                    Weak Subject Detection
                  </strong>

                  <p>
                    Find where students struggle
                  </p>

                </div>

              </div>


              <div className="output-card">

                <div className="output-icon">
                  ✦
                </div>

                <div>

                  <strong>
                    AI Recommendations
                  </strong>

                  <p>
                    Suggest actionable interventions
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            WORKFLOW
        =================================================== */}

        <section
          className="workflow-section"
          id="workflow"
        >

          <div className="workflow-header">

            <span>
              FROM DATA TO INTERVENTION
            </span>

            <h2>

              Four steps.
              <br />

              <em>
                One intelligent loop.
              </em>

            </h2>

          </div>


          <div className="workflow-grid">

            <div className="workflow-step">

              <small>01</small>

              <div className="step-number">
                01
              </div>

              <h3>
                Collect
              </h3>

              <p>
                Bring together attendance, assignments,
                examinations and academic records.
              </p>

            </div>


            <div className="workflow-step">

              <small>02</small>

              <div className="step-number">
                02
              </div>

              <h3>
                Analyze
              </h3>

              <p>
                Identify patterns across subjects,
                assessments and student behaviour.
              </p>

            </div>


            <div className="workflow-step">

              <small>03</small>

              <div className="step-number">
                03
              </div>

              <h3>
                Predict
              </h3>

              <p>
                Detect academic risk and identify
                students who may need early support.
              </p>

            </div>


            <div className="workflow-step">

              <small>04</small>

              <div className="step-number">
                04
              </div>

              <h3>
                Intervene
              </h3>

              <p>
                Give teachers and students clear,
                personalized recommendations.
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            STUDENT INTELLIGENCE
        =================================================== */}

        <section className="student-section">

          <div className="student-image">

            <img
              src={campus2}
              alt="KIT Campus"
            />

            <div className="student-image-label">
              STUDENT INTELLIGENCE
            </div>

          </div>


          <div className="student-content">

            <span>
              SEE THE DIFFERENCE
            </span>

            <h2>
              From a student's data
              <br />
              <em>to a decision.</em>
            </h2>

            <p>
              Academic Intelligence doesn't just show numbers.
              It explains what changed, why it matters and what
              should happen next.
            </p>


            {/* CLEAN AI PREVIEW
                No high-risk student block */}

            <div className="student-preview">

              <div className="preview-header">

                <div>

                  <span>
                    AI PERFORMANCE INSIGHT
                  </span>

                  <h3>
                    Academic signals detected
                  </h3>

                </div>

                <div className="preview-icon">
                  ✦
                </div>

              </div>


              <div className="preview-row">

                <div>
                  <span>Attendance</span>
                  <strong>82%</strong>
                </div>

                <div>
                  <span>Assignments</span>
                  <strong>88%</strong>
                </div>

                <div>
                  <span>Performance</span>
                  <strong>76%</strong>
                </div>

              </div>


              <div className="preview-insight">

                <div className="insight-dot"></div>

                <div>

                  <strong>
                    Early pattern detected
                  </strong>

                  <p>
                    The system compares attendance,
                    assignments and examination performance
                    to identify changes before they become
                    larger academic problems.
                  </p>

                </div>

              </div>


              <div className="preview-footer">

                <span>
                  AI ANALYSIS
                </span>

                <span>
                  EXPLAINABLE · ACTIONABLE
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            KIT
        =================================================== */}

        <section
          className="kit-section"
          id="about"
        >

          <div className="kit-content">

            <span>
              BUILT FOR KIT
            </span>

            <h2>
              Intelligence designed
              <br />
              around the <em>institution.</em>
            </h2>

            <p>
              Academic Intelligence connects the academic ecosystem
              of KalaignarKarunanidhi Institute of Technology with a
              single intelligence layer for students, teachers and
              administrators.
            </p>

            <a
              href="https://kitcbe.com/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Visit KIT official website →
            </a>

          </div>


          <div className="kit-image">

            <img
              src={campus2}
              alt="KalaignarKarunanidhi Institute of Technology"
            />

            <div className="kit-overlay">

              <img
                src={kitLogo}
                alt="KIT"
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            ACHIEVEMENTS
        =================================================== */}

        <section
          className="achievements-section"
          id="achievements"
        >

          <div className="achievements-heading">

            <span>
              KIT IN ACTION
            </span>

            <h2>
              A real academic
              <br />
              <em>ecosystem.</em>
            </h2>

            <p>
              The platform is designed around a real institutional
              environment, connecting academic data with meaningful
              insights and outcomes.
            </p>

          </div>


          <div className="achievement-grid">

            <div className="achievement-card">

              <div className="achievement-image">

                <img
                  src={achievement1}
                  alt="KIT Achievement 1"
                />

              </div>

              <div className="achievement-caption">

                <span>01</span>

                <strong>
                  Academic Excellence
                </strong>

              </div>

            </div>


            <div className="achievement-card">

              <div className="achievement-image">

                <img
                  src={achievement2}
                  alt="KIT Achievement 2"
                />

              </div>

              <div className="achievement-caption">

                <span>02</span>

                <strong>
                  Career & Placement Success
                </strong>

              </div>

            </div>


            <div className="achievement-card">

              <div className="achievement-image">

                <img
                  src={achievement3}
                  alt="KIT Achievement 3"
                />

              </div>

              <div className="achievement-caption">

                <span>03</span>

                <strong>
                  Ranking at top!
                  
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <section className="final-cta">

          <div className="cta-logo">

            <img
              src={kitLogo}
              alt="KIT"
            />

          </div>


          <span>
            ACADEMIC INTELLIGENCE
          </span>


          <h2>
            Don't wait for the
            <br />
            final result.
          </h2>


          <p>
            Discover the signals before they become problems.
          </p>


          <a
            href="/login"
            className="primary-button"
          >
            Enter Academic Intelligence →
          </a>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <div className="footer-brand">

          <div className="footer-logo">

            <img
              src={kitLogo}
              alt="KIT"
            />

          </div>


          <div>

            <strong>
              Academic Intelligence
            </strong>

            <span>
              AI-powered academic performance platform
            </span>

          </div>

        </div>


        <div className="footer-location">

          KalaignarKarunanidhi Institute of Technology
          <br />
          Coimbatore, Tamil Nadu

        </div>


        <div className="footer-copy">

          Hackathon Prototype · 2026

        </div>

      </footer>

    </div>
  );
}

export default Landing;