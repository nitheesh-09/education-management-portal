import "./AIInsights.css";

function AIInsights() {
  return (
    <div className="admin-ai-page">

      <div className="admin-ai-header">
        <p className="admin-ai-eyebrow">
          ADMIN PORTAL
        </p>

        <h1>AI Insights</h1>

        <p>
          View AI-generated academic and administrative insights.
        </p>
      </div>

      <div className="admin-ai-card">

        <div className="admin-ai-card-header">

          <div>
            <h2>Academic Insights</h2>

            <span>
              AI-generated insights will appear here.
            </span>
          </div>

        </div>

        <div className="admin-ai-empty">

          <div className="admin-ai-icon">
            AI
          </div>

          <h3>
            No insights available
          </h3>

          <p>
            Insights will be generated once sufficient
            academic data is available.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;