import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';

const AdminStatCard = ({
  icon: Icon,
  number,
  title,
  trend,
  trendDirection = 'up', // 'up' or 'down'
  to,
  iconColor = '#1B5CE2',
  iconBg = '#EBF2FF'
}) => {
  const isUp = trendDirection === 'up';

  return (
    <Link to={to} className="stat-box-modern">
      <div className="d-flex align-items-center gap-3">
        <div
          className="stat-icon-square"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {Icon && <Icon size={24} />}
        </div>

        <div>
          <div className="stat-number-giant">{number}</div>
          <div className="stat-title-label">{title}</div>
        </div>
      </div>

      {trend && (
        <div className={`stat-trend-tag ${isUp ? 'trend-green' : 'trend-red'}`}>
          {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span>{trend}</span>
        </div>
      )}
    </Link>
  );
};

export default AdminStatCard;
