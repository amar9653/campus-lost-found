
import { useCallback, useEffect, useState } from 'react';
import { AdminContext } from './AdminContextDefinition';
import { api, getData, reportView, errorMessage } from '../services/portal';

export const AdminProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState('');
  const [claims, setClaims] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Campus Administrator',
    badge: 'Admin',
    securityLevel: 'Administrator',
    office: '',
    joinedDate: '',
    avatar: ''
  });

  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    (message, type = 'success') =>
      setToast({
        id: Date.now(),
        message,
        type
      }),
    []
  );

  // Fetch admin dashboard data from backend
  const refresh = useCallback(async () => {
    if (!localStorage.getItem('adminToken')) {
      setReportsLoading(false);
      return;
    }

    setReportsLoading(true);

    const endpoints = [
      ['/admin/reports', x => setReports(x.map(reportView))],
      ['/admin/claims', setClaims],
      ['/admin/users', setUsers],
      ['/categories', setCategories],
      ['/notifications', setNotifications],
      [
        '/auth/me',
        u =>
          setProfile(p => ({
            ...p,
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            joinedDate: u.createdAt || ''
          }))
      ]
    ];

    const results = await Promise.allSettled(
      endpoints.map(async ([url, set]) => {
        set(await getData(url));
      })
    );

    const failures = results
      .map((r, i) =>
        r.status === 'rejected'
          ? `${endpoints[i][0]}: ${errorMessage(r.reason)}`
          : null
      )
      .filter(Boolean);

    setReportsError(failures.join(' | '));
    setReportsLoading(false);
  }, []);

  // Automatically refresh admin data
  useEffect(() => {
    Promise.resolve().then(refresh);

    const onFocus = () => refresh();

    window.addEventListener('focus', onFocus);

    const poll = window.setInterval(() => {
      if (!document.hidden) {
        refresh();
      }
    }, 15000);

    const onUpdate = () => refresh();

    window.addEventListener('campus-data-changed', onUpdate);

    return () => {
      window.clearInterval(poll);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('campus-data-changed', onUpdate);
    };
  }, [refresh]);

  // Common API action handler
  const action = async (fn, success) => {
    try {
      const result = await fn();

      await refresh();

      if (success) {
        showToast(success);
      }

      return result;
    } catch (e) {
      showToast(errorMessage(e), 'danger');
      return false;
    }
  };

  // REPORT MANAGEMENT
  const updateReportStatus = (id, status, reason = '') =>
    action(
      () =>
        api.patch(`/admin/reports/${id}/status`, {
          status: status.toLowerCase(),
          reason
        }),
      `Report ${status.toLowerCase()}`
    );

  const archiveReport = id =>
    updateReportStatus(id, 'Archived');

  // CLAIM MANAGEMENT
  const updateClaimStatus = (id, status, remarks = '') =>
    action(
      () =>
        api.patch(`/admin/claims/${id}`, {
          status,
          remarks
        }),
      `Claim ${status.toLowerCase()}`
    );

  // USER MANAGEMENT
  const approveUserAccount = id =>
    action(
      () =>
        api.patch(`/admin/users/${id}/status`, {
          status: 'Active'
        }),
      'Student activated'
    );

  const rejectUserAccount = id =>
    action(
      () =>
        api.patch(`/admin/users/${id}/status`, {
          status: 'Rejected'
        }),
      'Student rejected'
    );

  const toggleUserStatus = id => {
    const u = users.find(x => x.id === id);

    return action(
      () =>
        api.patch(`/admin/users/${id}/status`, {
          status: u?.status === 'Active'
            ? 'Suspended'
            : 'Active'
        }),
      'User status updated'
    );
  };

  // CATEGORY MANAGEMENT - MONGODB API

  // Add category
  const addCategory = (name, description) =>
    action(
      () =>
        api.post('/categories', {
          name,
          description
        }),
      'Category added'
    );

  // Update category
  const updateCategory = (id, name, description) =>
    action(
      () =>
        api.put(`/categories/${id}`, {
          name,
          description
        }),
      'Category updated'
    );

  // Delete category
  const deleteCategory = id =>
    action(
      () => api.delete(`/categories/${id}`),
      'Category deleted'
    );

  // NOTIFICATION MANAGEMENT
  const markNotificationAsRead = id =>
    action(() =>
      api.patch(`/notifications/${id}/read`)
    );

  const markAllNotificationsAsRead = () =>
    action(() =>
      api.patch('/notifications/read-all')
    );

  // PROFILE MANAGEMENT
  const updateProfile = data =>
    action(
      () =>
        api.patch('/profile', {
          name: data.name,
          phone: data.phone
        }),
      'Profile updated'
    );

  return (
    <AdminContext.Provider
      value={{
        reports,
        reportsLoading,
        reportsError,
        claims,
        categories,
        users,
        notifications,
        profile,
        toast,
        showToast,
        refresh,
        approveUserAccount,
        rejectUserAccount,
        toggleUserStatus,
        updateReportStatus,
        archiveReport,
        updateClaimStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateProfile
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
