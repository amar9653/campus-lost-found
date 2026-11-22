import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Bell,
  Save,
  Lock
} from 'lucide-react';
import { useAdmin } from '../../context/useAdmin';

const AdminProfile = () => {
  const { profile, updateProfile, showToast } = useAdmin();

  // Profile Form State
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    office: profile.office,
    role: profile.role
  });

  // Password State
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passError, setPassError] = useState('');

  // Preferences State
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    claimSubmissions: true,
    weeklyReport: false,
    soundAlerts: true
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passData.currentPassword) {
      setPassError('Please enter your current password.');
      return;
    }
    if (passData.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setPassError('');
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Administrator password updated successfully.');
  };

  return (
    <div>
      <div className="row g-4">
        {/* Left Column: Admin Card & Profile Info */}
        <div className="col-lg-4">
          <div className="admin-card text-center">
            <div className="position-relative d-inline-block mx-auto mb-3">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="rounded-circle border border-3 border-teal shadow-sm"
                  style={{ width: 110, height: 110, objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                style={{
                  width: 110,
                  height: 110,
                  fontSize: '2.5rem',
                  display: profile.avatar ? 'none' : 'flex'
                }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span
                className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                style={{ width: 18, height: 18 }}
              ></span>
            </div>

            <h5 className="fw-bold text-dark mb-1">{profile.name}</h5>
            <p className="text-muted mb-2" style={{ fontSize: '0.82rem' }}>
              {profile.role}
            </p>
            <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.75rem' }}>
              {profile.securityLevel}
            </span>

            <hr className="my-3 text-muted" />

            <div className="text-start d-flex flex-column gap-2" style={{ fontSize: '0.83rem' }}>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Mail size={15} /> <span>{profile.email}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Phone size={15} /> <span>{profile.phone}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Building size={15} /> <span>{profile.office}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Shield size={15} /> <span>Active since {profile.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Tabs */}
        <div className="col-lg-8">
          {/* Edit Profile Details */}
          <div className="admin-card mb-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <User size={18} className="text-primary" /> Edit Administrator Profile
              </h3>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    Office / Admin Room
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  />
                </div>

                <div className="col-12 text-end mt-3">
                  <button type="submit" className="btn-admin-primary">
                    <Save size={15} /> Save Profile Changes
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="admin-card mb-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Lock size={18} className="text-primary" /> Change Admin Password
              </h3>
            </div>

            {passError && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem' }}>{passError}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    placeholder="At least 6 chars"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                    placeholder="Re-type new password"
                  />
                </div>

                <div className="col-12 text-end mt-3">
                  <button type="submit" className="btn btn-sm btn-outline-dark px-3 py-2 fw-semibold">
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Bell size={18} className="text-primary" /> Notification Preferences
              </h3>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                <label className="form-check-label text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                  Email Alerts for Urgent Reports
                  <div className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                    Receive notification email when high-tier electronic devices are reported.
                  </div>
                </label>
                <input
                  className="form-check-input ms-3"
                  type="checkbox"
                  checked={prefs.emailAlerts}
                  onChange={(e) => setPrefs({ ...prefs, emailAlerts: e.target.checked })}
                />
              </div>

              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 border-top pt-2">
                <label className="form-check-label text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                  Student Claim Submissions
                  <div className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                    Instant dashboard alert whenever an ownership dispute or claim is opened.
                  </div>
                </label>
                <input
                  className="form-check-input ms-3"
                  type="checkbox"
                  checked={prefs.claimSubmissions}
                  onChange={(e) => setPrefs({ ...prefs, claimSubmissions: e.target.checked })}
                />
              </div>

              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 border-top pt-2">
                <label className="form-check-label text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                  Weekly Lost & Found Digest
                  <div className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                    Automated summary of items awaiting claimant collection.
                  </div>
                </label>
                <input
                  className="form-check-input ms-3"
                  type="checkbox"
                  checked={prefs.weeklyReport}
                  onChange={(e) => setPrefs({ ...prefs, weeklyReport: e.target.checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

