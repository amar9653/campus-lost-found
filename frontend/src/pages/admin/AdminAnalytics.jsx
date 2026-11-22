import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  XCircle,
  PackageCheck,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminChart from '../../components/admin/AdminChart';
import {
  analyticsTrendData,
  categoryDistributionData
} from '../../data/dashboardData';

const AdminAnalytics = () => {
  const { reports, claims } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('Last 6 Months');

  // Real-time calculated values
  const totalLost = reports.filter((r) => r.type === 'Lost').length;
  const totalFound = reports.filter((r) => r.type === 'Found').length;
  const totalClaims = claims.length;
  const approvedClaims = claims.filter((c) => c.status === 'Approved').length;
  const rejectedClaims = claims.filter((c) => c.status === 'Rejected').length;
  const returnedItems = claims.filter((c) => c.status === 'Completed').length;

  const trendData = analyticsTrendData[selectedPeriod] || analyticsTrendData['Last 6 Months'];

  // Lost vs Found ratio data
  const lostVsFoundData = [
    { name: 'Lost Reports', value: totalLost || 5, color: '#ef4444' },
    { name: 'Found Reports', value: totalFound || 3, color: '#3b82f6' }
  ];

  return (
    <div>
      {/* 6 Key Analytics Metric Cards - 3 Per Row */}
      <div className="stat-cards-cluster-3 mb-4">
        <AdminStatCard
          icon={FileText}
          title="Total Lost Reports"
          number={totalLost}
          trend="Reported missing"
          trendDirection="up"
          to="/admin/reports?type=Lost"
          iconColor="#EF4444"
          iconBg="#FEE2E2"
        />
        <AdminStatCard
          icon={FileText}
          title="Total Found Reports"
          number={totalFound}
          trend="Recovered items"
          trendDirection="up"
          to="/admin/reports?type=Found"
          iconColor="#3B82F6"
          iconBg="#DBEAFE"
        />
        <AdminStatCard
          icon={ShieldCheck}
          title="Total Claims"
          number={totalClaims}
          trend="+12% filed"
          trendDirection="up"
          to="/admin/claims"
          iconColor="#1B5CE2"
          iconBg="#EBF2FF"
        />
        <AdminStatCard
          icon={CheckCircle}
          title="Approved Claims"
          number={approvedClaims}
          trend="Verified ownership"
          trendDirection="up"
          to="/admin/claims?status=Approved"
          iconColor="#10B981"
          iconBg="#DCFCE7"
        />
        <AdminStatCard
          icon={XCircle}
          title="Rejected Claims"
          number={rejectedClaims}
          trend="2% rejected"
          trendDirection="down"
          to="/admin/claims?status=Rejected"
          iconColor="#EF4444"
          iconBg="#FEE2E2"
        />
        <AdminStatCard
          icon={PackageCheck}
          title="Returned Items"
          number={returnedItems}
          trend="Handover rate: 85%"
          trendDirection="up"
          to="/admin/claims?status=Completed"
          iconColor="#8B5CF6"
          iconBg="#F3E8FF"
        />
      </div>

      {/* Main Reports vs Claims Line Activity */}
      <div className="mb-4">
        <AdminChart
          data={trendData}
          period={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          title="Monthly Activity & Reporting Trends"
          subtitle="Timeline view of item disclosures compared with claim disputes"
        />
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Most Reported Categories Bar Chart */}
        <div className="col-lg-7">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">
                  <BarChart2 size={18} className="text-primary" /> Most Reported Categories
                </h3>
                <p className="admin-card-subtitle">Distribution of campus items lost & discovered</p>
              </div>
            </div>

            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistributionData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.8rem'
                    }}
                  />
                  <Bar dataKey="count" fill="#18A49D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lost vs Found Ratio Donut */}
        <div className="col-lg-5">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">
                  <PieIcon size={18} className="text-primary" /> Lost vs. Found Ratio
                </h3>
                <p className="admin-card-subtitle">Proportion of lost versus discovered reports</p>
              </div>
            </div>

            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lostVsFoundData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {lostVsFoundData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '0.8rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="d-flex justify-content-center gap-4 mt-3">
              {lostVsFoundData.map((d, i) => (
                <div key={i} className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: d.color
                    }}
                  ></span>
                  <span className="text-muted">{d.name}:</span>
                  <span className="fw-bold text-dark">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

