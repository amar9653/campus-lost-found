import React, { useState } from 'react';
import {
  Settings,
  Save
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminSettings = () => {
  const { showToast } = useAdmin();

  const [settings, setSettings] = useState({
    portalName: 'CampusFind - Lost & Found Portal',
    campusInstitution: 'State University of Technology',
    retentionDays: 60,
    autoArchiveExpired: true,
    requirePhotoEvidence: false,
    publicViewingWithoutLogin: true,
    claimReviewWindowDays: 7,
    supportEmail: 'lostandfound@campus.edu'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Portal configuration settings saved successfully.');
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Settings size={20} className="text-primary" /> System & Operational Configuration
            </h3>
            <p className="admin-card-subtitle">
              Manage portal parameters, retention duration, and security requirements
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* General Campus Settings */}
            <div className="col-md-6">
              <h6 className="fw-bold text-navy mb-3">General Portal Attributes</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Portal Branding Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.portalName}
                  onChange={(e) => setSettings({ ...settings, portalName: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Campus / University Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.campusInstitution}
                  onChange={(e) => setSettings({ ...settings, campusInstitution: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Administrative Support Desk Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>

            {/* Retention & Moderation Rules */}
            <div className="col-md-6">
              <h6 className="fw-bold text-navy mb-3">Retention & Claim Policies</h6>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Found Item Retention Period (Days before archival)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({ ...settings, retentionDays: Number(e.target.value) })}
                />
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Items unclaimed after this duration will transition to Archived state.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Claim Review Time Limit (Days)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.claimReviewWindowDays}
                  onChange={(e) =>
                    setSettings({ ...settings, claimReviewWindowDays: Number(e.target.value) })
                  }
                />
              </div>

              <div className="form-check form-switch mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoArchive"
                  checked={settings.autoArchiveExpired}
                  onChange={(e) =>
                    setSettings({ ...settings, autoArchiveExpired: e.target.checked })
                  }
                />
                <label className="form-check-label fw-semibold" htmlFor="autoArchive" style={{ fontSize: '0.85rem' }}>
                  Enable Automated Report Archival
                </label>
              </div>

              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="publicView"
                  checked={settings.publicViewingWithoutLogin}
                  onChange={(e) =>
                    setSettings({ ...settings, publicViewingWithoutLogin: e.target.checked })
                  }
                />
                <label className="form-check-label fw-semibold" htmlFor="publicView" style={{ fontSize: '0.85rem' }}>
                  Allow Anonymous Students to Browse Found Feed
                </label>
              </div>
            </div>
          </div>

          <div className="border-top pt-4 mt-4 text-end">
            <button type="submit" className="btn-admin-primary">
              <Save size={15} /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;

