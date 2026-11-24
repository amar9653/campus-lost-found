import { useState } from 'react';
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/useAdmin';

const AdminNavbar = ({ onToggleSidebar, pageTitle, pageDescription }) => {
  const { notifications, markNotificationAsRead, profile } = useAdmin();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="top-navbar-clean">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-light border-0 p-2 d-flex align-items-center"
          onClick={onToggleSidebar}
          title="Toggle Navigation"
        >
          <Menu size={20} color="#111E2E" />
        </button>

        <div className="navbar-page-title">
          <h1>{pageTitle || 'Admin Dashboard'}</h1>
          <p>{pageDescription || 'Overview of Campus Lost & Found Portal'}</p>
        </div>
      </div>

      <div className="navbar-right-cluster">
        {/* Notification Bell */}
        <div className="position-relative">
          <button
            className="notif-bell-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notif-badge-bubble">{unreadCount}</span>
            )}
          </button>

          {showNotifMenu && (
            <div
              className="position-absolute bg-white rounded-3 shadow-lg border p-2"
              style={{ top: '48px', right: '-10px', width: '320px', zIndex: 1050 }}
            >
              <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                <span className="fw-bold" style={{ fontSize: '0.86rem' }}>
                  Notifications
                </span>
                <Link
                  to="/admin/notifications"
                  className="text-primary text-decoration-none fw-semibold"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setShowNotifMenu(false)}
                >
                  View All
                </Link>
              </div>

              <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      setShowNotifMenu(false);
                    }}
                  >
                    <div className="fw-semibold text-dark" style={{ fontSize: '0.8rem' }}>
                      {n.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {n.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar & Dropdown */}
        <div className="position-relative">
          <div
            className="admin-avatar-cluster"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="admin-circle-avatar">A</div>
            <div className="admin-name-text">
              <span>{profile.name || "Admin"}</span>
              <ChevronDown size={14} color="#7E8B9B" />
            </div>
          </div>

          {showProfileMenu && (
            <div
              className="position-absolute bg-white rounded-3 shadow-lg border p-2"
              style={{ top: '48px', right: 0, minWidth: '180px', zIndex: 1050 }}
            >
              <Link
                to="/admin/profile"
                className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded"
                style={{ fontSize: '0.84rem' }}
                onClick={() => setShowProfileMenu(false)}
              >
                <User size={15} /> Admin Profile
              </Link>
              <Link
                to="/admin/settings"
                className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded"
                style={{ fontSize: '0.84rem' }}
                onClick={() => setShowProfileMenu(false)}
              >
                <Settings size={15} /> Settings
              </Link>
              <div className="dropdown-divider my-1"></div>
              <button
                className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded text-danger border-0 bg-transparent w-100 text-start"
                style={{ fontSize: '0.84rem' }}
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  window.location.href = '/admin';
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
