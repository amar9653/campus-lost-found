import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, Info, Check, Clock } from 'lucide-react';
import { useAdmin } from '../../context/useAdmin';

const NotificationPanel = () => {
  const { notifications } = useAdmin();

  // Pick color and icon based on message content to match the reference graphic
  const getIconData = (notif) => {
    const text = (notif.title + ' ' + notif.message).toLowerCase();
    if (text.includes('approved')) {
      return { bg: '#DCFCE7', color: '#16A34A', icon: <Check size={14} /> };
    }
    if (text.includes('under review')) {
      return { bg: '#FEF3C7', color: '#D97706', icon: <Clock size={14} /> };
    }
    if (text.includes('found item') || text.includes('water bottle')) {
      return { bg: '#F3E8FF', color: '#9333EA', icon: <Info size={14} /> };
    }
    return { bg: '#E0F2FE', color: '#0284C7', icon: <Info size={14} /> };
  };

  return (
    <div className="custom-card h-100">
      <div className="card-header-clean">
        <h3 className="card-title-clean">
          <Bell size={20} color="#1B5CE2" /> Notifications
        </h3>
        <Link to="/admin/notifications" className="view-all-link">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="d-flex flex-column">
        {notifications.slice(0, 4).map((n) => {
          const { bg, color, icon } = getIconData(n);
          return (
            <div key={n.id} className="notif-row">
              <div className="notif-left">
                <div
                  className="notif-icon-circle"
                  style={{ backgroundColor: bg, color: color }}
                >
                  {icon}
                </div>
                <div className="notif-msg">{n.message}</div>
              </div>

              <div className="notif-time">{n.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPanel;
