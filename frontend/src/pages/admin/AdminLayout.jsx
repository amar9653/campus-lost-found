import { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useAdmin } from '../../context/useAdmin';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Import Admin Styles
import '../../styles/admin.css';
import '../../styles/adminDashboard.css';
import '../../styles/adminTables.css';
import '../../styles/adminResponsive.css';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { toast, reportsError, reportsLoading } = useAdmin();
  const location = useLocation();

  // Double-layer protection: check token inside layout
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  const getHeaderMeta = () => {
    const path = location.pathname;
    if (path.includes('/admin/reports')) {
      return {
        title: 'Manage Reports',
        description: 'Review, verify and moderate campus lost & found reports'
      };
    }
    if (path.includes('/admin/claims/')) {
      return {
        title: 'Claim Verification',
        description: 'Verify claimant ownership proof and process handovers'
      };
    }
    if (path.includes('/admin/claims')) {
      return {
        title: 'Manage Claims',
        description: 'Review student ownership claims and issue resolutions'
      };
    }
    if (path.includes('/admin/users')) {
      return {
        title: 'Users',
        description: 'Manage campus student and faculty registrations'
      };
    }
    if (path.includes('/admin/categories')) {
      return {
        title: 'Categories',
        description: 'Organize item categories and lost & found groupings'
      };
    }
    if (path.includes('/admin/notifications')) {
      return {
        title: 'Notifications',
        description: 'System activity updates, alerts and student submissions'
      };
    }
    if (path.includes('/admin/analytics')) {
      return {
        title: 'Reports & Analytics',
        description: 'Campus lost & found recovery metrics and performance trends'
      };
    }
    if (path.includes('/admin/profile')) {
      return {
        title: 'Admin Profile',
        description: 'Administrator credentials and contact information'
      };
    }
    if (path.includes('/admin/settings')) {
      return {
        title: 'Settings',
        description: 'Configure portal parameters and retention policies'
      };
    }
    return {
      title: 'Admin Dashboard',
      description: 'Overview of Campus Lost & Found Portal'
    };
  };

  const { title, description } = getHeaderMeta();

  return (
    <div className="app-container">
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className={`main-content-layout ${isCollapsed ? 'collapsed' : ''}`}>
        <AdminNavbar
          pageTitle={title}
          pageDescription={description}
          onToggleSidebar={() => {
            if (window.innerWidth <= 992) {
              setIsMobileOpen(!isMobileOpen);
            } else {
              setIsCollapsed(!isCollapsed);
            }
          }}
        />

        <main className="dashboard-viewport">
          {reportsLoading && <div className="alert alert-info">Loading MongoDB data...</div>}
          {reportsError && <div className="alert alert-danger" role="alert">Unable to load some backend data: {reportsError}</div>}
          <Outlet />
        </main>
      </div>

      {toast && (
        <div className="admin-toast-container">
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === 'danger' ? (
              <AlertCircle size={20} className="text-danger flex-shrink-0" />
            ) : (
              <CheckCircle2 size={20} className="text-success flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
