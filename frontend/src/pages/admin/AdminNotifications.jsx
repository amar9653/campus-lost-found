import { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Search,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAdmin } from '../../context/useAdmin';
import { Link } from 'react-router-dom';

const AdminNotifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAdmin();
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = notifications.filter((n) => {
    if (filterType === 'Unread' && n.read) return false;
    if (filterType === 'Read' && !n.read) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div>
      <div className="admin-card">
        {/* Header & Controls */}
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Bell size={20} className="text-primary" /> Notifications & Alerts Center
            </h3>
            <p className="admin-card-subtitle">
              Audit feed of reports, ownership disputes, and system events
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              onClick={markAllNotificationsAsRead}
            >
              <CheckCheck size={15} /> Mark All as Read
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search notification messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              {['All', 'Unread', 'Read'].map((t) => (
                <button
                  key={t}
                  className={`filter-tab-btn ${filterType === t ? 'active' : ''}`}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar-right">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {filtered.length} notification entries
            </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="d-flex flex-column gap-2">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Bell size={40} className="opacity-50 mb-2" />
              <p className="mb-0">No notifications match your current filter.</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-3 border d-flex align-items-start justify-content-between ${
                  !n.read ? 'bg-light border-primary' : 'bg-white'
                }`}
                style={{
                  borderLeft: !n.read ? '4px solid #18A49D' : '1px solid #E2E8F0',
                  transition: 'all 0.15s ease'
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="mt-1 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 38,
                      height: 38,
                      backgroundColor: !n.read ? '#E7F6F5' : '#F1F5F9',
                      color: !n.read ? '#18A49D' : '#64748B',
                      flexShrink: 0
                    }}
                  >
                    {n.type === 'claim' && <ShieldCheck size={18} />}
                    {n.type === 'report' && <FileText size={18} />}
                    {n.type === 'alert' && <AlertTriangle size={18} />}
                    {n.type === 'review' && <Clock size={18} />}
                    {n.type === 'success' && <Info size={18} />}
                  </div>

                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.92rem' }}>
                        {n.title}
                      </h6>
                      {!n.read && (
                        <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-muted mb-2 mt-1" style={{ fontSize: '0.84rem' }}>
                      {n.message}
                    </p>

                    <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.78rem' }}>
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Clock size={12} /> {n.time}
                      </span>
                      {n.link && (
                        <Link to={n.link} className="text-primary fw-semibold text-decoration-none">
                          Take Action →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {!n.read && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => markNotificationAsRead(n.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;

