
import React, { useEffect, useState } from 'react';
import {
  FileText,
  Shield,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Check,
  Folder
} from 'lucide-react';

import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminChart from '../../components/admin/AdminChart';
import RecentClaims from '../../components/admin/RecentClaims';
import RecentReports from '../../components/admin/RecentReports';
import NotificationPanel from '../../components/admin/NotificationPanel';
import { useAdmin } from '../../context/useAdmin';
import { analyticsTrendData } from '../../data/dashboardData';

const AdminDashboard = () => {
  const { reports, claims } = useAdmin();

  const [trendPeriod, setTrendPeriod] = useState('Last 6 Months');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError('');

        const token = localStorage.getItem('adminToken');

        if (!token) {
          throw new Error('Admin session not found. Please log in again.');
        }

        const response = await fetch(
          'http://localhost:5000/api/admin/stats',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || 'Failed to load dashboard statistics'
          );
        }

        setStats(result.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatsError(error.message);
          setStats(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();

    return () => controller.abort();
  }, []);

  const getStat = (key) => {
    if (statsLoading) return '...';

    if (!stats || typeof stats[key] !== 'number') {
      return '—';
    }

    return stats[key];
  };

  const chartData =
    analyticsTrendData[trendPeriod] ||
    analyticsTrendData['Last 6 Months'];

  return (
    <div>
      {/* Dashboard API error */}
      {statsError && (
        <div className="alert alert-danger" role="alert">
          {statsError}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stat-cards-cluster">
        <AdminStatCard
          icon={FileText}
          title="Total Reports"
          number={getStat('totalReports')}
          to="/admin/reports"
          iconColor="#1B5CE2"
          iconBg="#EBF2FF"
        />

        <AdminStatCard
          icon={Shield}
          title="Total Claims"
          number="—"
          to="/admin/claims"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />

        <AdminStatCard
          icon={Clock}
          title="Pending Claims"
          number="—"
          to="/admin/claims?status=Pending"
          iconColor="#F59E0B"
          iconBg="#FEF3C7"
        />

        <AdminStatCard
          icon={Search}
          title="Under Review"
          number="—"
          to="/admin/claims?status=Under Review"
          iconColor="#8B5CF6"
          iconBg="#F3E8FF"
        />

        <AdminStatCard
          icon={CheckCircle}
          title="Approved Claims"
          number="—"
          to="/admin/claims?status=Approved"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />

        <AdminStatCard
          icon={XCircle}
          title="Rejected Claims"
          number="—"
          to="/admin/claims?status=Rejected"
          iconColor="#EF4444"
          iconBg="#FEE2E2"
        />

        <AdminStatCard
          icon={Check}
          title="Returned Items"
          number={getStat('returnedItems')}
          to="/admin/reports?status=Returned"
          iconColor="#0D9488"
          iconBg="#CCFBF1"
        />

        <AdminStatCard
          icon={Folder}
          title="Active Reports"
          number={getStat('activeReports')}
          to="/admin/reports"
          iconColor="#1B5CE2"
          iconBg="#EBF2FF"
        />
      </div>

      {/* Reports & Claims Overview + Recent Claims */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <AdminChart
            data={chartData}
            period={trendPeriod}
            onPeriodChange={setTrendPeriod}
          />
        </div>

        <div className="col-lg-6">
          <RecentClaims claims={claims} />
        </div>
      </div>

      {/* Recent Reports + Notifications */}
      <div className="row g-4">
        <div className="col-lg-6">
          <RecentReports reports={reports} />
        </div>

        <div className="col-lg-6">
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
