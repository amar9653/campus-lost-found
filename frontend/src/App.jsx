import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public & User Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import UserDashboard from './pages/user/UserDashboard';
import CreateLostReport from './pages/user/CreateLostReport';
import FoundItemReport from './pages/user/FoundItemReport';
import SearchItems from './pages/user/SearchItems';
import MyClaims from './pages/user/MyClaims';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';

// Admin Context & Layout
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageReports from './pages/admin/ManageReports';
import ManageClaims from './pages/admin/ManageClaims';
import ClaimDetails from './pages/admin/ClaimDetails';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Student Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/report-lost" element={<CreateLostReport />} />
          <Route path="/report-found" element={<FoundItemReport />} />
          <Route path="/search" element={<SearchItems />} />
          <Route path="/claims" element={<MyClaims />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />

          {/* Dedicated Admin Login Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<ManageReports />} />
            <Route path="claims" element={<ManageClaims />} />
            <Route path="claims/:id" element={<ClaimDetails />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
