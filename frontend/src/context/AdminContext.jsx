import { useEffect, useState } from 'react';
import { AdminContext } from './AdminContextDefinition';
import { initialClaims } from '../data/claimsData';

import { initialCategories } from '../data/categoriesData';

import { initialUsers } from '../data/usersData';

import { initialNotifications } from '../data/notificationsData';

import { adminProfileData } from '../data/dashboardData';


const API_BASE_URL = 'http://localhost:5000';

// Convert MongoDB report into existing frontend format

const formatReport = (report) => {

  const imagePath = report.images?.[0];

  const image = imagePath

    ? imagePath.startsWith('http')

      ? imagePath

      : `${API_BASE_URL}/${imagePath.replace(/^\/+/, '')}`

    : null;

  return {

    id: report._id,

    itemName: report.itemName,

    type: report.type

      ? report.type.charAt(0).toUpperCase() + report.type.slice(1)

      : 'Unknown',

    category: report.category,

    reportedBy: report.user?.name || 'Unknown',

    reporterEmail: report.user?.email || '',

    location: report.location,

    date: report.createdAt

      ? new Date(report.createdAt).toLocaleDateString('en-IN', {

        day: 'numeric',

        month: 'short',

        year: 'numeric'

      })

      : '—',

    status: report.status

      ? report.status.charAt(0).toUpperCase() + report.status.slice(1)

      : 'Unknown',

    description: report.description,

    image,

    contactNumber: report.contact || '',
    isActive: report.isActive,
    rejectionReason: report.rejectionReason || '',
    eventDate: report.eventDate,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt

  };

};

export const AdminProvider = ({ children }) => {

  // Real MongoDB reports

  const [reports, setReports] = useState([]);

  const [reportsLoading, setReportsLoading] = useState(true);

  const [reportsError, setReportsError] = useState('');

  // Existing frontend data

  const [claims, setClaims] = useState(initialClaims);

  const [categories, setCategories] = useState(initialCategories);

  const [users, setUsers] = useState(initialUsers);

  const [notifications, setNotifications] = useState(initialNotifications);

  const [profile, setProfile] = useState(adminProfileData);

  const [toast, setToast] = useState(null);

  // Fetch all reports from MongoDB

  useEffect(() => {

    const controller = new AbortController();

    const fetchAdminReports = async () => {

      setReportsLoading(true);

      setReportsError('');

      try {

        const token = localStorage.getItem('adminToken');

        if (!token) {

          setReports([]);

          setReportsError('Admin session not found. Please log in again.');

          return;

        }

        const response = await fetch(

          `${API_BASE_URL}/api/admin/reports`,

          {

            method: 'GET',

            headers: {

              Authorization: `Bearer ${token}`

            },

            signal: controller.signal

          }

        );

        const result = await response.json();

        if (!response.ok || !result.success) {

          throw new Error(

            result.message || 'Failed to fetch admin reports'

          );

        }

        const formattedReports = (result.data || []).map(formatReport);

        if (!controller.signal.aborted) {

          setReports(formattedReports);

        }

      } catch (error) {

        if (error.name !== 'AbortError') {

          console.error('Failed to load admin reports:', error);

          if (!controller.signal.aborted) {

            setReports([]);

            setReportsError(error.message);

          }

        }

      } finally {

        if (!controller.signal.aborted) {

          setReportsLoading(false);

        }

      }

    };

    fetchAdminReports();

    return () => controller.abort();

  }, []);

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

    showToast(

      `Account ${userId} approved by SuperAdmin! User can now submit reports and file claims.`

    );

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

          const newStatus =

            u.status === 'Active' ? 'Suspended' : 'Active';

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

  // Persist admin report actions to MongoDB before updating the UI.

  const updateReportStatus = async (
    reportId,
    newStatus,
    reason = ''
  ) => {
    const status = String(newStatus).toLowerCase();

    const allowedStatuses = [
      'approved',
      'rejected',
      'archived'
    ];

    if (!allowedStatuses.includes(status)) {
      showToast('Unsupported report status', 'danger');
      return false;
    }

    if (
      status === 'rejected' &&
      (typeof reason !== 'string' || !reason.trim())
    ) {
      showToast('Please provide a rejection reason', 'danger');
      return false;
    }

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        throw new Error(
          'Admin session not found. Please log in again.'
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/reports/${encodeURIComponent(reportId)}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status,
            reason: status === 'rejected' ? reason.trim() : ''
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || 'Failed to update report status'
        );
      }

      const updatedReport = formatReport(result.data);

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? updatedReport
            : report
        )
      );

      showToast(
        `Report ${reportId} marked as ${updatedReport.status}`
      );

      return true;
    } catch (error) {
      console.error('Failed to update admin report:', error);

      showToast(
        error.message || 'Failed to update report',
        'danger'
      );

      return false;
    }
  };


  const archiveReport = async (reportId) => {
    return updateReportStatus(reportId, 'Archived');
  };

  // Claims state modifiers

  const updateClaimStatus = (

    claimId,

    newStatus,

    remarks = '',

    handoverDetails = null

  ) => {

    setClaims((prev) =>

      prev.map((clm) => {

        if (clm.id === claimId) {

          const historyEntry = {

            status: newStatus,

            date: new Date().toLocaleString([], {

              dateStyle: 'short',

              timeStyle: 'short'

            }),

            by: `${profile.name} (${profile.badge})`,

            notes: remarks || `Status changed to ${newStatus}`

          };

          return {

            ...clm,

            status: newStatus,

            adminRemarks: remarks || clm.adminRemarks,

            handoverDetails:

              handoverDetails || clm.handoverDetails,

            history: [

              historyEntry,

              ...(clm.history || [])

            ]

          };

        }

        return clm;

      })

    );

    showToast(

      `Claim ${claimId} successfully moved to ${newStatus}`

    );

  };

  // Category state modifiers

  const addCategory = (name, description) => {

    const trimmed = name.trim();

    if (

      categories.some(

        (c) => c.name.toLowerCase() === trimmed.toLowerCase()

      )

    ) {

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

    if (

      categories.some(

        (c) =>

          c.id !== id &&

          c.name.toLowerCase() === trimmed.toLowerCase()

      )

    ) {

      showToast(

        'Category with this name already exists!',

        'danger'

      );

      return false;

    }

    setCategories((prev) =>

      prev.map((c) =>

        c.id === id

          ? {

            ...c,

            name: trimmed,

            description: description.trim()

          }

          : c

      )

    );

    showToast('Category updated successfully');

    return true;

  };

  const deleteCategory = (id) => {

    setCategories((prev) =>

      prev.filter((c) => c.id !== id)

    );

    showToast('Category deleted successfully', 'warning');

  };

  // Notification state modifiers

  const markNotificationAsRead = (id) => {

    setNotifications((prev) =>

      prev.map((n) =>

        n.id === id ? { ...n, read: true } : n

      )

    );

  };

  const markAllNotificationsAsRead = () => {

    setNotifications((prev) =>

      prev.map((n) => ({ ...n, read: true }))

    );

    showToast('All notifications marked as read');

  };

  // Profile update

  const updateProfile = (updatedData) => {

    setProfile((prev) => ({

      ...prev,

      ...updatedData

    }));

    showToast('Profile information updated successfully');

  };

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
