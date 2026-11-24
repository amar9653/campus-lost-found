
import { useState, useEffect } from 'react';
import { api, getData, errorMessage } from '../../services/portal';
import {
  Bell, Package, CheckCircle, Clock, Trash2,
  Check, AlertCircle
} from 'lucide-react';
import '../../styles/Dashboard.css';


function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loadError,setLoadError]=useState('');
  useEffect(()=>{getData('/notifications').then(setNotifications).catch(e=>setLoadError(errorMessage(e)));},[]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async id => {try{await api.patch(`/notifications/${id}/read`);setNotifications(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));}catch(e){setLoadError(errorMessage(e));}};
  const markAllAsRead = async () => {try{await api.patch('/notifications/read-all');setNotifications(prev=>prev.map(n=>({...n,read:true})));}catch(e){setLoadError(errorMessage(e));}};
  const deleteNotification = async id => {try{await api.delete(`/notifications/${id}`);setNotifications(prev=>prev.filter(n=>n.id!==id));}catch(e){setLoadError(errorMessage(e));}};

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle size={22} />;
    if (type === 'pending') return <Clock size={22} />;
    if (type === 'item') return <Package size={22} />;
    return <AlertCircle size={22} />;
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {loadError && <p role="alert">{loadError}</p>}

        <div className="notifications-header">
          <div className="notification-heading-icon">
            <Bell size={27} />
          </div>
          <div>
            <h2>Notifications & Alerts</h2>
            <p>Stay updated about your lost and found items.</p>
          </div>
        </div>

        <div className="notification-summary">
          <div>
            <span>Total Notifications</span>
            <h3>{notifications.length}</h3>
          </div>
          <div>
            <span>Unread Notifications</span>
            <h3>{unreadCount}</h3>
          </div>
        </div>

        <div className="notifications-card">
          <div className="notifications-card-heading">
            <div>
              <h3>Recent Notifications</h3>
              <p>You have {unreadCount} unread notifications.</p>
            </div>

            <button type="button" onClick={markAllAsRead}>
              <Check size={16} /> Mark all as read
            </button>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  key={notification.id}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h4>{notification.title}</h4>
                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>

                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.time).toLocaleString()}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        type="button"
                        title="Mark as read"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check size={17} />
                      </button>
                    )}

                    <button
                      type="button"
                      title="Delete notification"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="notifications-empty">
                <Bell size={40} />
                <h3>No Notifications</h3>
                <p>You are all caught up!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Notifications;
