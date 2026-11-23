import { api, getData, errorMessage } from '../../services/portal';
import { useEffect } from 'react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, AlertCircle, Package,
  SearchCheck, ClipboardList, User, LogOut, Edit,
  Save, X, Mail, Phone, GraduationCap, IdCard,
  Camera, Bell, Lock, Trash2, ChevronRight,
  Building2, CheckCircle
} from 'lucide-react';

import '../../styles/Dashboard.css';

function Profile() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser') || 'null'
  );

  const initialProfile = {
    name: loggedInUser?.fullName || 'Student User',
    email: loggedInUser?.email || '',
    phone: loggedInUser?.phone || '',
    studentId: loggedInUser?.studentId || '',
    department: loggedInUser?.department || 'Computer Engineering',
    role: 'Student',
    college: ''
  };

  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [photo] = useState(
    ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = () => alert('Profile photo upload is not supported by the backend yet.');

  useEffect(()=>{let active=true; if(localStorage.getItem('studentToken'))getData('/auth/me').then(u=>{if(!active)return;const updated={name:u.name,email:u.email,phone:u.phone||'',studentId:u.studentId||'',department:u.department||'',role:'Student',college:''};setProfile(updated);setSavedProfile(updated);}).catch(()=>{});return()=>{active=false;};},[]);
  const handleSave = async e => {
    e.preventDefault();
    if(profile.phone && !/^[0-9]{10}$/.test(profile.phone)){alert('Please enter a valid 10-digit phone number.');return;}
    try{const response=await api.patch('/profile',{name:profile.name,phone:profile.phone,studentId:profile.studentId,department:profile.department});const u=response.data.data;
      const updated={...profile,name:u.name,phone:u.phone||'',studentId:u.studentId||'',department:u.department||''};setProfile(updated);setSavedProfile(updated);setIsEditing(false);
      localStorage.setItem('loggedInUser',JSON.stringify({fullName:u.name,email:u.email,phone:u.phone,studentId:u.studentId,department:u.department}));
      setSuccessMessage('Profile updated successfully!');
    }catch(err){alert(errorMessage(err));}
  };

  // Cancel editing
  const handleCancel = () => {
    setProfile(savedProfile);
    setIsEditing(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('studentToken');
    navigate('/login');
  };

  const handleChangePassword = async () => {
    const currentPassword=window.prompt('Current password:');if(!currentPassword)return;
    const newPassword=window.prompt('New password (minimum 6 characters):');if(!newPassword)return;
    try{await api.patch('/password',{currentPassword,newPassword});alert('Password updated successfully.');}
    catch(err){alert(errorMessage(err));}
  };

  const handleNotificationSettings = () => {
    navigate('/notifications');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account?'
    );

    if (confirmed) {
      alert('Please contact the administrator to delete your account.');
    }
  };

  return (
    <div className="profile-dashboard-layout">

      {/* Sidebar */}
      <aside className="profile-sidebar">

        <div className="profile-sidebar-brand">
          <div className="profile-brand-icon">
            <Search size={29} />
          </div>

          <div>
            <h3>Campus</h3>
            <h3>Lost & Found</h3>
          </div>
        </div>

        <nav className="profile-sidebar-nav">

          <p className="profile-sidebar-label">MAIN MENU</p>

          <Link to="/dashboard" className="profile-sidebar-link">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          <Link to="/report-lost" className="profile-sidebar-link">
            <AlertCircle size={19} />
            Report Lost Item
          </Link>

          <Link to="/report-found" className="profile-sidebar-link">
            <Package size={19} />
            Report Found Item
          </Link>

          <Link to="/search" className="profile-sidebar-link">
            <SearchCheck size={19} />
            Search & Filter
          </Link>

          <Link to="/claims" className="profile-sidebar-link">
            <ClipboardList size={19} />
            My Claims
          </Link>

          <Link to="/notifications" className="profile-sidebar-link">
            <Bell size={19} />
            Notifications
          </Link>

          <p className="profile-sidebar-label account-label">
            ACCOUNT
          </p>

          <Link to="/profile" className="profile-sidebar-link active">
            <User size={19} />
            Profile
          </Link>

          <button
            type="button"
            className="sidebar-link logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>

        </nav>

        <div className="profile-sidebar-footer">
          <p>Campus Lost & Found Portal</p>
          <small>Find it. Claim it. Reclaim it.</small>
        </div>

      </aside>

      {/* Main Content */}
      <main className="profile-main-content">

        {/* Header */}
        <header className="profile-page-title">
          <div>
            <h2>My Profile</h2>
            <p>View and manage your account details</p>
          </div>

          <div className="profile-header-user">

            <Link
              to="/notifications"
              className="profile-header-notification"
              title="Notifications"
            >
              <Bell size={24} />
            </Link>

            <div className="profile-header-avatar">
              {photo ? (
                <img src={photo} alt="Profile" />
              ) : (
                initials || 'U'
              )}
            </div>

            <div>
              <strong>{profile.name}</strong>
              <small>Student Account</small>
            </div>

          </div>
        </header>

        <div className="profile-page-content">

          {successMessage && (
            <div className="profile-success-message">
              <CheckCircle size={18} />
              {successMessage}
            </div>
          )}

          <div className="profile-reference-layout">

            {/* Left Profile Card */}
            <section className="profile-reference-card">

              <div className="profile-cover"></div>

              <div className="profile-avatar-container">

                <div className="profile-reference-avatar">
                  {photo ? (
                    <img src={photo} alt="Student profile" />
                  ) : (
                    initials || 'U'
                  )}
                </div>

                <label className="profile-camera-button">
                  <Camera size={21} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>

              </div>

              <div className="profile-reference-info">
                <h3>{profile.name}</h3>

                <span className="profile-student-badge">
                  <GraduationCap size={18} />
                  Student
                </span>

                <p className="profile-college-name">
                  <Building2 size={19} />
                  {profile.college}
                </p>
              </div>

              <div className="profile-activity-stats">

                <div>
                  <FileIcon />
                  <strong>3</strong>
                  <span>Reports</span>
                </div>

                <div>
                  <CheckCircle size={21} />
                  <strong>1</strong>
                  <span>Claims</span>
                </div>

                <div>
                  <Bell size={21} />
                  <strong>5</strong>
                  <span>Notifications</span>
                </div>

              </div>

              <button
                type="button"
                className="profile-edit-main-button"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={18} />
                Edit Profile
              </button>

            </section>

            {/* Right Content */}
            <div className="profile-right-content">

              {/* Personal Information */}
              <section className="profile-information-card">

                <div className="profile-card-heading">
                  <h2>
                    <User size={25} />
                    Personal Information
                  </h2>

                  {!isEditing && (
                    <button
                      type="button"
                      className="profile-edit-button"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={17} />
                      Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave}>

                  <div className="profile-information-grid">

                    <ProfileField
                      icon={<User />}
                      label="Full Name"
                      name="name"
                      value={profile.name}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      icon={<GraduationCap />}
                      label="Role"
                      value={profile.role}
                    />

                    <ProfileField
                      icon={<Mail />}
                      label="Email"
                      name="email"
                      value={profile.email}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      icon={<IdCard />}
                      label="Student ID"
                      name="studentId"
                      value={profile.studentId}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      icon={<Phone />}
                      label="Phone Number"
                      name="phone"
                      value={profile.phone}
                      isEditing={isEditing}
                      onChange={handleChange}
                      type="tel"
                      maxLength={10}
                    />

                    <ProfileField
                      icon={<GraduationCap />}
                      label="Department"
                      name="department"
                      value={profile.department}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                  </div>

                  {isEditing && (
                    <div className="profile-reference-actions">

                      <button
                        type="button"
                        className="profile-cancel-button"
                        onClick={handleCancel}
                      >
                        <X size={17} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="profile-save-button"
                      >
                        <Save size={17} />
                        Save Changes
                      </button>

                    </div>
                  )}

                </form>
              </section>

              {/* Account Settings */}
              <section className="profile-settings-card">

                <div className="profile-card-heading settings-heading">
                  <h2>
                    <span className="profile-settings-symbol">⚙</span>
                    Account Settings
                  </h2>
                </div>

                <button
                  type="button"
                  className="profile-setting-item"
                  onClick={handleChangePassword}
                >
                  <span className="profile-setting-icon">
                    <Lock />
                  </span>

                  <span className="profile-setting-text">
                    <strong>Change Password</strong>
                    <small>Update your account password</small>
                  </span>

                  <ChevronRight />
                </button>

                <button
                  type="button"
                  className="profile-setting-item"
                  onClick={handleNotificationSettings}
                >
                  <span className="profile-setting-icon">
                    <Bell />
                  </span>

                  <span className="profile-setting-text">
                    <strong>Notification Preferences</strong>
                    <small>Manage email and alert notifications</small>
                  </span>

                  <ChevronRight />
                </button>

                <button
                  type="button"
                  className="profile-setting-item delete-setting"
                  onClick={handleDeleteAccount}
                >
                  <span className="profile-setting-icon">
                    <Trash2 />
                  </span>

                  <span className="profile-setting-text">
                    <strong>Delete Account</strong>
                    <small>Permanently delete your account</small>
                  </span>

                  <ChevronRight />
                </button>

              </section>

            </div>
          </div>
        </div>

        <footer className="profile-page-footer">
          © 2026 Campus Lost & Found Portal. All Rights Reserved.
        </footer>

      </main>
    </div>
  );
}

// Reusable personal information field
function ProfileField({
  icon,
  label,
  name,
  value,
  isEditing,
  onChange,
  type = 'text',
  maxLength
}) {
  return (
    <div className="profile-detail-row">

      <span className="profile-detail-icon">
        {icon}
      </span>

      <div className="profile-detail-content">
        <strong>{label}</strong>

        {isEditing && name ? (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            maxLength={maxLength}
            required={name === 'name' || name === 'email'}
          />
        ) : (
          <p>{value || 'Not provided'}</p>
        )}
      </div>

    </div>
  );
}

function FileIcon() {
  return <ClipboardList size={21} />;
}

export default Profile;
