import React from 'react';

const StatusBadge = ({ status, type }) => {
  if (type) {
    const isLost = type.toLowerCase() === 'lost';
    return (
      <span className={`badge-clean ${isLost ? 'badge-clean-lost' : 'badge-clean-found'}`}>
        {type}
      </span>
    );
  }

  const s = (status || '').toLowerCase().trim();

  let cls = 'badge-clean-pending';
  if (s === 'approved') cls = 'badge-clean-approved';
  else if (s === 'under review') cls = 'badge-clean-review';
  else if (s === 'rejected') cls = 'badge-clean-rejected';
  else if (s === 'completed' || s === 'returned') cls = 'badge-clean-completed';
  else if (s === 'active') cls = 'badge-clean-approved';

  return <span className={`badge-clean ${cls}`}>{status}</span>;
};

export default StatusBadge;
