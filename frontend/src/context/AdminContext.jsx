import React, { createContext, useContext, useState } from 'react';
import { initialReports } from '../data/reportsData';
import { initialClaims } from '../data/claimsData';
import { initialCategories } from '../data/categoriesData';
import { initialUsers } from '../data/usersData';
import { initialNotifications } from '../data/notificationsData';
import { adminProfileData } from '../data/dashboardData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [reports, setReports] = useState(initialReports);
  const [claims, setClaims] = useState(initialClaims);
  const [categories, setCategories] = useState(initialCategories);
  const [users, setUsers] = useState(initialUsers);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [profile, setProfile] = useState(adminProfileData);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // User Approval / Suspension state modifiers for SuperAdmin
  const approveUserAccount = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'Active',
            canReportAndClaim: true,
            approvedAt: new Date().toISOString(),
            approvedBy: profile.name
          };
        }
        return u;
      })
    );
    showToast(`Account ${userId} approved by SuperAdmin! User can now submit reports and file claims.`);
  };

  const rejectUserAccount = (userId, reason = '') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'Rejected',
            canReportAndClaim: false,
            rejectionReason: reason
          };
        }
        return u;
      })
    );
    showToast(`User registration for ${userId} rejected.`, 'danger');
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          return {
            ...u,
            status: newStatus,
            canReportAndClaim: newStatus === 'Active'
          };
        }
        return u;
      })
    );
  };

  // Reports state modifiers
  const updateReportStatus = (reportId, newStatus, reason = '') => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            status: newStatus,
            rejectionReason: reason || rep.rejectionReason,
            updatedAt: new Date().toISOString()
          };
        }
        return rep;
      })
    );
    showToast(`Report ${reportId} marked as ${newStatus}`);
  };

  const archiveReport = (reportId) => {
    updateReportStatus(reportId, 'Archived');
  };

  // Claims state modifiers
  const updateClaimStatus = (claimId, newStatus, remarks = '', handoverDetails = null) => {
    setClaims((prev) =>
      prev.map((clm) => {
        if (clm.id === claimId) {
          const historyEntry = {
            status: newStatus,
            date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            by: `${profile.name} (${profile.badge})`,
            notes: remarks || `Status changed to ${newStatus}`
          };
          return {
            ...clm,
            status: newStatus,
            adminRemarks: remarks || clm.adminRemarks,
            handoverDetails: handoverDetails || clm.handoverDetails,
            history: [historyEntry, ...(clm.history || [])]
          };
        }
        return clm;
      })
    );
    showToast(`Claim ${claimId} successfully moved to ${newStatus}`);
  };

  // Category state modifiers
  const addCategory = (name, description) => {
    const trimmed = name.trim();
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category name already exists!', 'danger');
      return false;
    }
    const newCat = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      description: description.trim(),
      count: 0
    };
    setCategories((prev) => [newCat, ...prev]);
    showToast(`Category "${trimmed}" added successfully`);
    return true;
  };

  const updateCategory = (id, name, description) => {
    const trimmed = name.trim();
    if (categories.some((c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category with this name already exists!', 'danger');
      return false;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed, description: description.trim() } : c))
    );
    showToast('Category updated successfully');
    return true;
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted successfully', 'warning');
  };

  // Notification state modifiers
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Profile update
  const updateProfile = (updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));
    showToast('Profile information updated successfully');
  };

  return (
    <AdminContext.Provider
      value={{
        reports,
        claims,
        categories,
        users,
        notifications,
        profile,
        toast,
        showToast,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => useContext(AdminContext);
