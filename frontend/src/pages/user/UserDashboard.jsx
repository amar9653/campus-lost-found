
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

function UserDashboard() {
  const navigate = useNavigate();

  // Get logged-in student information
  const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser') || 'null'
  );

  const studentName = loggedInUser?.fullName || 'Student User';
  const studentEmail = loggedInUser?.email || '';
  const firstLetter = studentName.charAt(0).toUpperCase();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <span className="brand-icon">🔍</span>
          <div>
            <h3>Campus</h3>
            <h3>Lost & Found</h3>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="sidebar-label">MAIN MENU</p>

          <Link to="/dashboard" className="sidebar-link active">
            <span>▦</span> Dashboard
          </Link>

          <Link to="/report-lost" className="sidebar-link">
            <span>⚠</span> Report Lost Item
          </Link>

          <Link to="/report-found" className="sidebar-link">
            <span>◇</span> Report Found Item
          </Link>

          <Link to="/search" className="sidebar-link">
            <span>⌕</span> Search & Filter
          </Link>

          <Link to="/claims" className="sidebar-link">
            <span>▤</span> My Claims
          </Link>

          <Link to="/notifications" className="sidebar-link">
            <span>♧</span> Notifications
          </Link>

          <p className="sidebar-label account-label">ACCOUNT</p>

          <Link to="/profile" className="sidebar-link">
            <span>♙</span> Profile
          </Link>

          <button
  type="button"
  className="sidebar-link logout-button"
  onClick={handleLogout}
>
  <span>↪</span>
  Logout
</button>

        </nav>

        <div className="sidebar-footer">
          <p>Campus Lost & Found Portal</p>
          <small>Find it. Claim it. Reclaim it.</small>
        </div>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main" id="dashboard">

        {/* Topbar */}
        <header className="dashboard-topbar">

          <div>
            <h4>User Dashboard</h4>
            <p>Manage your lost and found items</p>
          </div>

          <div className="user-info">

            <Link
              to="/notifications"
              className="notification-icon"
              title="Notifications"
            >
              ♧
            </Link>

            <div
  className="user-info profile-trigger"
  onClick={() => navigate('/profile')}
  title="View Profile"
>
  <div className="user-avatar">
    {studentName.charAt(0).toUpperCase()}
  </div>

  <div>
    <strong>{studentName}</strong>

    <small>Student Account</small>
  </div>
</div>
          </div>

        </header>

        {/* Welcome Banner */}
        <section className="welcome-banner">

          <div>
            <span className="welcome-tag">
              CAMPUS LOST & FOUND PORTAL
            </span>

            <h1>Welcome Back, {studentName}!</h1>

            <p>
              Find, report and reclaim lost items on your campus.
              We are here to help you reconnect with your belongings.
            </p>
          </div>

          <div className="welcome-illustration">
            🎒 🔎
          </div>

        </section>

        {/* Action Cards */}
        <section className="dashboard-actions">

          <h2>What would you like to do?</h2>

          <div className="dashboard-grid">

            <div className="action-card lost-card">
              <div className="action-icon">⚠️</div>
              <h3>Report Lost Item</h3>
              <p>
                Report an item that you have lost on campus.
              </p>
              <Link to="/report-lost" className="dashboard-action-button">
                + Create Lost Report
              </Link>
            </div>

            <div className="action-card found-card">
              <div className="action-icon">📦</div>
              <h3>Report Found Item</h3>
              <p>
                Help someone recover an item you have found.
              </p>
              <Link to="/report-found" className="dashboard-action-button">
                + Create Found Report
              </Link>
            </div>

            <div className="action-card search-card">
              <div className="action-icon">🔍</div>
              <h3>Search & Filter</h3>
              <p>
                Search for lost and found items on campus.
              </p>
              <Link to="/search" className="dashboard-action-button">
                Search Items
              </Link>
            </div>

            <div className="action-card claims-card">
              <div className="action-icon">📋</div>
              <h3>My Claims</h3>
              <p>
                Track and manage your submitted claims.
              </p>
              <Link to="/claims" className="dashboard-action-button">
                View My Claims
              </Link>
            </div>

          </div>
        </section>

        {/* Recent Reports and Claim Status */}
        <section className="dashboard-bottom-grid">

          <div className="dashboard-panel">

            <div className="panel-heading">
              <h3>📄 My Recent Reports</h3>
              <Link to="/search">View All →</Link>
            </div>

            <div className="report-item">
              <div className="report-image">🎒</div>

              <div className="report-details">
                <strong>Black Backpack</strong>
                <p>Lost • Library</p>
                <small>Sample report</small>
              </div>

              <span className="status-badge pending">
                Pending
              </span>
            </div>

            <div className="report-item">
              <div className="report-image">🎧</div>

              <div className="report-details">
                <strong>Wireless Earphones</strong>
                <p>Found • Cafeteria</p>
                <small>Sample report</small>
              </div>

              <span className="status-badge available">
                Available
              </span>
            </div>

          </div>

          <div className="dashboard-panel">

            <div className="panel-heading">
              <h3>🛡 Claim Status</h3>
              <Link to="/claims">View All →</Link>
            </div>

            <div className="claim-progress">

              <div className="progress-step completed">
                <span>✓</span>
                <p>Submitted</p>
              </div>

              <div className="progress-line"></div>

              <div className="progress-step completed">
                <span>✓</span>
                <p>Under Review</p>
              </div>

              <div className="progress-line"></div>

              <div className="progress-step">
                <span>3</span>
                <p>Resolved</p>
              </div>

            </div>

            <div className="claim-message">
              <span>ℹ</span>
              Your sample claim is currently under review.
            </div>

          </div>

        </section>

        {/* Statistics */}
        <section className="statistics-section">

          <h2>Quick Statistics</h2>

          <div className="statistics-grid">

            <div className="stat-card">
              <span className="stat-icon blue">📦</span>
              <div>
                <h3>02</h3>
                <p>Total Reports</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon green">✓</span>
              <div>
                <h3>01</h3>
                <p>Resolved Claims</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon orange">◷</span>
              <div>
                <h3>01</h3>
                <p>Pending Claims</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon purple">★</span>
              <div>
                <h3>120</h3>
                <p>Your Points</p>
              </div>
            </div>

          </div>

        </section>

        <footer className="dashboard-footer">
          © 2026 Campus Lost & Found Portal. All Rights Reserved.
        </footer>

      </main>

    </div>
  );
}

export default UserDashboard;
