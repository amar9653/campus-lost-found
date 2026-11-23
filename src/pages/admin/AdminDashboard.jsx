
import { useState } from 'react';
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
import { makeTrend } from '../../utils/analytics';

const AdminDashboard = () => {
  const { reports, claims } = useAdmin();

  const [trendPeriod, setTrendPeriod] = useState('Last 6 Months');
  const stats = {
    totalReports:reports.length, activeReports:reports.filter(r=>r.status==='Approved'&&r.isActive).length,
    pendingReports:reports.filter(r=>r.status==='Pending').length,
    returnedItems:reports.filter(r=>r.status==='Returned').length
  };
  const getStat = key => stats[key] ?? 0;
  const statsError = '';

  const chartData = makeTrend(reports, claims, trendPeriod);

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
          number={claims.length}
          to="/admin/claims"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />

        <AdminStatCard
          icon={Clock}
          title="Pending Claims"
          number={claims.filter(c=>c.status==='Pending').length}
          to="/admin/claims?status=Pending"
          iconColor="#F59E0B"
          iconBg="#FEF3C7"
        />

        <AdminStatCard
          icon={Search}
          title="Under Review"
          number={claims.filter(c=>c.status==='Under Review').length}
          to="/admin/claims?status=Under Review"
          iconColor="#8B5CF6"
          iconBg="#F3E8FF"
        />

        <AdminStatCard
          icon={CheckCircle}
          title="Approved Claims"
          number={claims.filter(c=>c.status==='Approved').length}
          to="/admin/claims?status=Approved"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />

        <AdminStatCard
          icon={XCircle}
          title="Rejected Claims"
          number={claims.filter(c=>c.status==='Rejected').length}
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
