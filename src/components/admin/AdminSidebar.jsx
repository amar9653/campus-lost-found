import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Shield,
  Users,
  Grid,
  Bell,
  BarChart2,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import campusBuildingImg from '../../assets/campus-building.png';

const AdminSidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { label: 'Manage Reports', path: '/admin/reports', icon: FileText },
    { label: 'Manage Claims', path: '/admin/claims', icon: Shield },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Categories', path: '/admin/categories', icon: Grid },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart2 },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const accountMenuItems = [
    { label: 'Admin Profile', path: '/admin/profile', icon: User }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="position-fixed inset-0 bg-dark opacity-50 z-index-199"
          style={{ inset: 0, zIndex: 199 }}
          onClick={onCloseMobile}
        ></div>
      )}

      <aside
        className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
      >
        <div>
          {/* Logo Section matching reference image */}
          <div className="brand-wrapper">
            <div className="brand-glass-icon">
              {/* Cyan glowing magnifying glass icon */}
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="17" cy="17" r="12" fill="url(#lensGrad)" />
                <circle cx="17" cy="17" r="10.5" stroke="#38BDF8" strokeWidth="2.5" />
                <path d="M26 26L35 35" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
                <circle cx="13" cy="13" r="3" fill="#FFFFFF" fillOpacity="0.8" />
                <defs>
                  <radialGradient id="lensGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 14) rotate(45) scale(14)">
                    <stop stopColor="#38BDF8" />
                    <stop offset="0.7" stopColor="#0284C7" />
                    <stop offset="1" stopColor="#0369A1" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            {!isCollapsed && (
              <div className="brand-text-block">
                <div className="brand-main-title">Campus</div>
                <div className="brand-sub-title">Lost &amp; Found</div>
              </div>
            )}
          </div>

          {/* ADMIN MENU Group */}
          {!isCollapsed && <div className="sidebar-menu-category">ADMIN MENU</div>}
          <div className="sidebar-nav-group">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `nav-pill-item ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} strokeWidth={2.2} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* ACCOUNT Group */}
          {!isCollapsed && <div className="sidebar-menu-category mt-4">ACCOUNT</div>}
          <div className="sidebar-nav-group">
            {accountMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `nav-pill-item ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} strokeWidth={2.2} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}

            <button
              onClick={handleLogout}
              className="nav-pill-item w-100 bg-transparent border-0 text-start"
              style={{ cursor: 'pointer' }}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut size={20} strokeWidth={2.2} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Campus Building Graphic at bottom of sidebar matching image */}
        {!isCollapsed && (
          <div className="sidebar-building-graphic">
            <img
              src={campusBuildingImg}
              alt="Campus Building"
              className="sidebar-building-img"
            />
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
