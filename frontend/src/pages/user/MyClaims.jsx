
import React, { useState } from 'react';
import {
  Eye, CalendarDays, Package, ClipboardList
} from 'lucide-react';
import '../../styles/Dashboard.css';

const claimsData = [
  {
    id: 'CLM001',
    itemName: 'Black Backpack',
    status: 'Pending',
    date: 'Nov 10, 2026',
    image: '/items/backpack.jpg'
  },
  {
    id: 'CLM002',
    itemName: 'AirPods',
    status: 'Under Review',
    date: 'Nov 8, 2026',
    image: '/items/airpods.jpg'
  },
  {
    id: 'CLM003',
    itemName: 'Wallet',
    status: 'Resolved',
    date: 'Nov 5, 2026',
    image: '/items/wallet.jpg'
  }
];

function MyClaims() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'Under Review', 'Resolved'];

  const filteredClaims = claimsData.filter(claim =>
    activeTab === 'All' || claim.status === activeTab
  );

  const getCount = (tab) => {
    if (tab === 'All') return claimsData.length;
    return claimsData.filter(claim => claim.status === tab).length;
  };

  const handleViewDetails = (claim) => {
    alert(
      `Claim ID: ${claim.id}\nItem: ${claim.itemName}\nStatus: ${claim.status}\nDate: ${claim.date}`
    );
  };

  return (
    <div className="my-claims-page">

      <div className="claims-container">

        {/* Heading */}
        <div className="claims-heading">
          <div className="claims-heading-icon">
            <ClipboardList size={28} />
          </div>

          <div>
            <h2>My Claims</h2>
            <p>Track the status of your submitted claims.</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="claims-summary">
          <div className="claims-summary-card">
            <span>Total Claims</span>
            <h3>{claimsData.length}</h3>
          </div>

          <div className="claims-summary-card pending-summary">
            <span>Pending</span>
            <h3>{getCount('Pending')}</h3>
          </div>

          <div className="claims-summary-card review-summary">
            <span>Under Review</span>
            <h3>{getCount('Under Review')}</h3>
          </div>

          <div className="claims-summary-card resolved-summary">
            <span>Resolved</span>
            <h3>{getCount('Resolved')}</h3>
          </div>
        </div>

        {/* Claims List */}
        <div className="claims-list-card">

          <div className="claims-list-header">
            <div>
              <h3>Claim History</h3>
              <p>View and manage your submitted claims.</p>
            </div>
            <Package size={27} />
          </div>

          {/* Tabs */}
          <div className="claims-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab} ({getCount(tab)})
              </button>
            ))}
          </div>

          {/* Claim Records */}
          <div className="claims-records">

            {filteredClaims.length > 0 ? (
              filteredClaims.map(claim => (
                <div className="claim-record" key={claim.id}>

                  <div className="claim-item-image">
                    <img
                      src={claim.image}
                      alt={claim.itemName}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="claim-item-info">
                    <h4>Claim #{claim.id}</h4>
                    <p>{claim.itemName}</p>
                  </div>

                  <span className={`claim-status ${claim.status.toLowerCase().replace(' ', '-')}`}>
                    {claim.status}
                  </span>

                  <div className="claim-date">
                    <CalendarDays size={16} />
                    <span>{claim.date}</span>
                  </div>

                  <button
                    className="claim-view-button"
                    type="button"
                    onClick={() => handleViewDetails(claim)}
                  >
                    <Eye size={15} />
                    View Details
                  </button>

                </div>
              ))
            ) : (
              <div className="claims-empty">
                <Package size={40} />
                <h3>No claims found</h3>
                <p>You don't have any claims in this category.</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default MyClaims;
