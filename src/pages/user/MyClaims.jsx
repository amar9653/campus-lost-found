
import { useState, useEffect } from 'react';
import { getData, BASE_URL } from '../../services/portal';
import {
  Eye, CalendarDays, Package, ClipboardList
} from 'lucide-react';
import '../../styles/Dashboard.css';

const API_ORIGIN = BASE_URL.replace(/\/api$/, '');

function getImageUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}/${path.replace(/^\/+/, '')}`;
}

function MyClaims() {
  const [activeTab, setActiveTab] = useState('All');
  const [claimsData, setClaimsData] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    let active = true;

    const loadClaims = async () => {
      try {
        const data = await getData('/claims/mine');

        if (!active) return;

        setClaimsData(
          (Array.isArray(data) ? data : []).map(claim => ({
            ...claim,
            date: claim.submissionDate
              ? new Date(claim.submissionDate).toLocaleDateString('en-IN')
              : 'Date unavailable',
            image: getImageUrl(claim.image)
          }))
        );

        setLoadError('');
      } catch (err) {
        if (active) setLoadError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadClaims();

    window.addEventListener('focus', loadClaims);

    const interval = setInterval(loadClaims, 15000);

    return () => {
      active = false;
      window.removeEventListener('focus', loadClaims);
      clearInterval(interval);
    };
  }, []);

  const tabs = [
    'All',
    'Pending',
    'Under Review',
    'Approved',
    'Rejected',
    'Completed'
  ];

  const filteredClaims = claimsData.filter(claim =>
    activeTab === 'All' || claim.status === activeTab
  );

  const getCount = tab => {
    if (tab === 'All') return claimsData.length;
    return claimsData.filter(claim => claim.status === tab).length;
  };

  return (
    <div className="my-claims-page">
      <div className="claims-container">

        {loadError && <p role="alert">{loadError}</p>}

        <div className="claims-heading">
          <div className="claims-heading-icon">
            <ClipboardList size={28} />
          </div>
          <div>
            <h2>My Claims</h2>
            <p>Track the status of your submitted claims.</p>
          </div>
        </div>

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
            <h3>{getCount('Completed')}</h3>
          </div>
        </div>

        <div className="claims-list-card">
          <div className="claims-list-header">
            <div>
              <h3>Claim History</h3>
              <p>View and manage your submitted claims.</p>
            </div>
            <Package size={27} />
          </div>

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

          <div className="claims-records">
            {loading ? (
              <div className="claims-empty">
                <p>Loading claims...</p>
              </div>
            ) : filteredClaims.length > 0 ? (
              filteredClaims.map(claim => (
                <div className="claim-record" key={claim.id}>

                  <div className="claim-item-image">
                    {claim.image ? (
                      <img
                        src={claim.image}
                        alt={claim.itemName}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package size={30} />
                    )}
                  </div>

                  <div className="claim-item-info">
                    <h4>Claim #{claim.id.slice(-8)}</h4>
                    <p>{claim.itemName}</p>
                  </div>

                  <span
                    className={`claim-status ${claim.status
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                  >
                    {claim.status}
                  </span>

                  <div className="claim-date">
                    <CalendarDays size={16} />
                    <span>{claim.date}</span>
                  </div>

                  <button
                    className="claim-view-button"
                    type="button"
                    onClick={() => setSelectedClaim(claim)}
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

        {selectedClaim && (
          <div
            role="presentation"
            onClick={() => setSelectedClaim(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              zIndex: 9999
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Claim Details"
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 24,
                width: '100%',
                maxWidth: 480,
                maxHeight: '85vh',
                overflowY: 'auto'
              }}
            >
              <h2>Claim Details</h2>

              <p><strong>Claim ID:</strong> {selectedClaim.id}</p>
              <p><strong>Item:</strong> {selectedClaim.itemName}</p>
              <p><strong>Status:</strong> {selectedClaim.status}</p>
              <p><strong>Submitted:</strong> {selectedClaim.date}</p>

              <p>
                <strong>Ownership Explanation:</strong>
              </p>
              <p>
                {selectedClaim.ownershipExplanation || 'Not provided'}
              </p>

              <p><strong>Admin Remarks:</strong></p>
              <p>
                {selectedClaim.adminRemarks || 'No remarks yet'}
              </p>

              <button
                type="button"
                className="claim-view-button"
                onClick={() => setSelectedClaim(null)}
                style={{ marginTop: 16 }}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyClaims;
