import React, { useState } from 'react';
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
import { useAdmin } from '../../context/AdminContext';
import { analyticsTrendData } from '../../data/dashboardData';

const AdminDashboard = () => {
  const { reports, claims } = useAdmin();
  const [trendPeriod, setTrendPeriod] = useState('Last 6 Months');

  const chartData = analyticsTrendData[trendPeriod] || analyticsTrendData['Last 6 Months'];

  return (
    <div>
      {/* 8 Statistics Cards matching the reference layout & exact styling */}
      <div className="stat-cards-cluster">
        {/* Row 1 */}
        <AdminStatCard
          icon={FileText}
          title="Total Reports"
          number={248}
          trend="12%"
          trendDirection="up"
          to="/admin/reports"
          iconColor="#1B5CE2"
          iconBg="#EBF2FF"
        />
        <AdminStatCard
          icon={Shield}
          title="Total Claims"
          number={86}
          trend="8%"
          trendDirection="up"
          to="/admin/claims"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />
        <AdminStatCard
          icon={Clock}
          title="Pending Claims"
          number={24}
          trend="5%"
          trendDirection="down"
          to="/admin/claims?status=Pending"
          iconColor="#F59E0B"
          iconBg="#FEF3C7"
        />
        <AdminStatCard
          icon={Search}
          title="Under Review"
          number={32}
          trend="6%"
          trendDirection="up"
          to="/admin/claims?status=Under Review"
          iconColor="#8B5CF6"
          iconBg="#F3E8FF"
        />

        {/* Row 2 */}
        <AdminStatCard
          icon={CheckCircle}
          title="Approved Claims"
          number={120}
          trend="10%"
          trendDirection="up"
          to="/admin/claims?status=Approved"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />
        <AdminStatCard
          icon={XCircle}
          title="Rejected Claims"
          number={18}
          trend="2%"
          trendDirection="down"
          to="/admin/claims?status=Rejected"
          iconColor="#EF4444"
          iconBg="#FEE2E2"
        />
        <AdminStatCard
          icon={Check}
          title="Returned Items"
          number={95}
          trend="15%"
          trendDirection="up"
          to="/admin/claims?status=Completed"
          iconColor="#0D9488"
          iconBg="#CCFBF1"
        />
        <AdminStatCard
          icon={Folder}
          title="Active Reports"
          number={180}
          trend="7%"
          trendDirection="up"
          to="/admin/reports?status=Approved"
          iconColor="#1B5CE2"
          iconBg="#EBF2FF"
        />
      </div>

      {/* Row 1: Reports & Claims Overview + Recent Claims */}
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

      {/* Row 2: Recent Reports + Notifications */}
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
