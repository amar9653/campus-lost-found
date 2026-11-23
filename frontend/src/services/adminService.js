import axios from 'axios';
import { initialReports } from '../data/reportsData';
import { initialClaims } from '../data/claimsData';
import { initialUsers } from '../data/usersData';
import { initialCategories } from '../data/categoriesData';
import { initialNotifications } from '../data/notificationsData';
import { analyticsTrendData, claimsBreakdownData, categoryDistributionData, recentActivities } from '../data/dashboardData';

// API base instance prepared for when backend endpoints are connected
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach auth token if available in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

/**
 * Service methods: each method attempts the real API if configured/available,
 * falling back gracefully to realistic mock data so frontend development and demos work flawlessly.
 */
export const adminService = {
  // 1. Dashboard statistics
  async getDashboardStats() {
    try {
      const res = await API.get('/admin/stats');
      return res.data;
    } catch {
      return {
        totalReports: initialReports.length,
        totalClaims: initialClaims.length,
        pendingClaims: initialClaims.filter(c => c.status === 'Pending').length,
        underReviewClaims: initialClaims.filter(c => c.status === 'Under Review').length,
        approvedClaims: initialClaims.filter(c => c.status === 'Approved').length,
        rejectedClaims: initialClaims.filter(c => c.status === 'Rejected').length,
        returnedItems: initialClaims.filter(c => c.status === 'Completed').length,
        activeReports: initialReports.filter(r => r.status === 'Approved').length,
        registeredUsers: initialUsers.length,
        pendingApprovals: initialReports.filter(r => r.status === 'Pending').length
      };
    }
  },

  // 2. Analytics & Trends
  async getAnalyticsData(period = 'Last 6 Months') {
    try {
      const res = await API.get(`/admin/analytics?period=${period}`);
      return res.data;
    } catch {
      return {
        trend: analyticsTrendData[period] || analyticsTrendData['Last 6 Months'],
        claimsBreakdown: claimsBreakdownData,
        categoryDistribution: categoryDistributionData,
        activities: recentActivities
      };
    }
  },

  // 3. Reports
  async getAllReports() {
    try {
      const res = await API.get('/admin/reports');
      return res.data;
    } catch {
      return [...initialReports];
    }
  },

  async getRecentReports(limit = 5) {
    try {
      const res = await API.get(`/admin/reports/recent?limit=${limit}`);
      return res.data;
    } catch {
      return initialReports.slice(0, limit);
    }
  },

  async updateReportStatus(reportId, status, rejectionReason = '') {
    try {
      const res = await API.patch(`/admin/reports/${reportId}/status`, { status, rejectionReason });
      return res.data;
    } catch {
      return { success: true, reportId, status, rejectionReason, updatedAt: new Date().toISOString() };
    }
  },

  // 4. Claims
  async getAllClaims() {
    try {
      const res = await API.get('/admin/claims');
      return res.data;
    } catch {
      return [...initialClaims];
    }
  },

  async getRecentClaims(limit = 5) {
    try {
      const res = await API.get(`/admin/claims/recent?limit=${limit}`);
      return res.data;
    } catch {
      return initialClaims.slice(0, limit);
    }
  },

  async getClaimDetails(claimId) {
    try {
      const res = await API.get(`/admin/claims/${claimId}`);
      return res.data;
    } catch {
      const claim = initialClaims.find(c => c.id === claimId);
      if (!claim) throw new Error(`Claim ${claimId} not found`);
      return { ...claim };
    }
  },

  async updateClaimStatus(claimId, newStatus, remarks = '', handoverDetails = null) {
    try {
      const res = await API.patch(`/admin/claims/${claimId}/status`, {
        status: newStatus,
        remarks,
        handoverDetails
      });
      return res.data;
    } catch {
      return {
        success: true,
        claimId,
        status: newStatus,
        remarks,
        handoverDetails,
        updatedAt: new Date().toISOString()
      };
    }
  },

  // 5. Users
  async getAllUsers() {
    try {
      const res = await API.get('/admin/users');
      return res.data;
    } catch {
      return [...initialUsers];
    }
  },

  // 6. Categories
  async getCategories() {
    try {
      const res = await API.get('/admin/categories');
      return res.data;
    } catch {
      return [...initialCategories];
    }
  },

  async addCategory(categoryData) {
    try {
      const res = await API.post('/admin/categories', categoryData);
      return res.data;
    } catch {
      return {
        id: 'cat-' + Date.now(),
        ...categoryData,
        count: 0
      };
    }
  },

  async updateCategory(categoryId, categoryData) {
    try {
      const res = await API.put(`/admin/categories/${categoryId}`, categoryData);
      return res.data;
    } catch {
      return { id: categoryId, ...categoryData };
    }
  },

  async deleteCategory(categoryId) {
    try {
      const res = await API.delete(`/admin/categories/${categoryId}`);
      return res.data;
    } catch {
      return { success: true, categoryId };
    }
  },

  // 7. Notifications
  async getNotifications() {
    try {
      const res = await API.get('/admin/notifications');
      return res.data;
    } catch {
      return [...initialNotifications];
    }
  },

  async markNotificationAsRead(id) {
    try {
      const res = await API.patch(`/admin/notifications/${id}/read`);
      return res.data;
    } catch {
      return { success: true, id };
    }
  },

  async markAllNotificationsAsRead() {
    try {
      const res = await API.patch('/admin/notifications/mark-all-read');
      return res.data;
    } catch {
      return { success: true };
    }
  }
};

export default adminService;

