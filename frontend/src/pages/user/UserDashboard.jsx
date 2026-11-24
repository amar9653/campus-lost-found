import { getData, reportView } from '../../services/portal';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

function UserDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [claims,setClaims]=useState([]);

  // Get logged-in student information
  const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser') || 'null'
  );

  const studentName = loggedInUser?.fullName || 'Student User';

  const [loadError,setLoadError] = useState('');
  useEffect(() => {
    let active=true;
    const load = async () => {
      if (!localStorage.getItem('studentToken')) return;
      try {const [data,claimData]=await Promise.all([getData('/reports/user/mine'),getData('/claims/mine')]);if(active){setReports(data.map(reportView));setClaims(claimData);setLoadError('');}}
      catch(err){if(active){setReports([]);setLoadError(err.message);}}
    };
    load();window.addEventListener('focus',load);
    return ()=>{active=false;window.removeEventListener('focus',load);};
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('studentToken');
    navigate('/login');
  };

  // Statistics
  const totalReports = reports.length;

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

          {/* My Recent Reports */}
          <div className="dashboard-panel">

            <div className="panel-heading">
              <h3>📄 My Recent Reports</h3>
              <Link to="/search">View All →</Link>
            </div>

            {loadError && <p role="alert">{loadError}</p>}
            {reports.length === 0 ? (

              <div className="empty-reports">
                <div style={{ fontSize: '35px' }}>📭</div>
                <p>You have not submitted any reports yet.</p>
                <small>Your submitted reports will appear here.</small>
              </div>

            ) : (

              reports
                .slice(0, 5)
                .map((report) => (

                  <div className="report-item" key={report.id}>

                    <div className="report-image">
                      {report.type === 'Lost' ? '⚠️' : '📦'}
                    </div>

                    <div className="report-details">

                      <strong>{report.itemName}</strong>

                      <p>
                        {report.type} • {report.location}
                      </p>

                      <small>{report.category}</small>

                      <br />

                      <small>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </small>

                    </div>

                    <span className="status-badge pending">
                      {report.status}
                    </span>

                  </div>

                ))

            )}

          </div>

          {/* Claim Status */}
          <div className="dashboard-panel">

            <div className="panel-heading">
              <h3>🛡 Claim Status</h3>
              <Link to="/claims">View All →</Link>
            </div>

            <div className="claim-message">
              {claims.length ? `Latest claim: ${claims[0].itemName} — ${claims[0].status}` : 'No claims submitted yet.'}
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
                <h3>{String(totalReports).padStart(2, '0')}</h3>
                <p>Total Reports</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon green">✓</span>
              <div>
                <h3>{claims.filter(c=>c.status==='Completed').length}</h3>
                <p>Resolved Claims</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon orange">◷</span>
              <div>
                <h3>{claims.filter(c=>c.status==='Pending').length}</h3>
                <p>Pending Claims</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon purple">★</span>
              <div><h3>{claims.length}</h3><p>Total Claims</p></div>
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
