import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Smartphone, Shirt, Wallet } from 'lucide-react';
import StatusBadge from './StatusBadge';

const RecentReports = ({ reports = [] }) => {
  const getItemIcon = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('iphone') || n.includes('phone') || n.includes('earbuds')) {
      return <Smartphone size={16} color="#4A5568" />;
    }
    if (n.includes('hoodie') || n.includes('jacket') || n.includes('clothing')) {
      return <Shirt size={16} color="#4A5568" />;
    }
    if (n.includes('wallet') || n.includes('bag')) {
      return <Wallet size={16} color="#4A5568" />;
    }
    return <FileText size={16} color="#4A5568" />;
  };

  return (
    <div className="custom-card h-100">
      <div className="card-header-clean">
        <h3 className="card-title-clean">
          <FileText size={20} color="#1B5CE2" /> Recent Reports
        </h3>
        <Link to="/admin/reports" className="view-all-link">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-responsive">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 3).map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span className="p-1 bg-light rounded d-flex align-items-center justify-content-center">
                      {getItemIcon(r.itemName)}
                    </span>
                    <span className="fw-semibold text-dark">{r.itemName}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge type={r.type} />
                </td>
                <td className="text-muted">{r.location}</td>
                <td className="text-muted">{r.date}</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReports;
