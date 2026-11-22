import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const RecentClaims = ({ claims = [] }) => {
  return (
    <div className="custom-card h-100">
      <div className="card-header-clean">
        <h3 className="card-title-clean">
          <Shield size={20} color="#10B981" /> Recent Claims
        </h3>
        <Link to="/admin/claims" className="view-all-link">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-responsive">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Item</th>
              <th>User</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {claims.slice(0, 5).map((c) => (
              <tr key={c.id}>
                <td className="fw-medium text-dark">{c.id}</td>
                <td className="fw-semibold text-dark">{c.itemName}</td>
                <td className="text-muted">{c.claimantName}</td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td className="text-muted">{c.submissionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentClaims;
