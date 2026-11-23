
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailInput = formData.email.trim().toLowerCase();
    const passwordInput = formData.password;

    // 1. Built-in Admin Credentials
    if (
      (emailInput === 'admin@campus.edu' || emailInput === 'admin@campusfind.com') &&
      passwordInput === 'admin123'
    ) {
      localStorage.setItem('adminToken', 'admin-token-' + Date.now());
      localStorage.setItem('token', 'admin-token-' + Date.now());
      alert('Welcome Administrator! Logging in to Admin Dashboard...');
      navigate('/admin/dashboard');
      return;
    }

    // 2. Regular Student / User Login
    const existingUsers = JSON.parse(
      localStorage.getItem('campusUsers') || '[]'
    );

    const user = existingUsers.find(
      (item) =>
        item.email.toLowerCase() === emailInput &&
        item.password === passwordInput
    );

    if (!user) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    // Save currently logged-in student
    const loggedInUser = {
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId,
      department: user.department
    };

    localStorage.setItem(
      'loggedInUser',
      JSON.stringify(loggedInUser)
    );

    alert(`Welcome ${user.fullName}! Login successful.`);

    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />

      <section className="auth-section">
        <div className="container">
          <div className="auth-card login-card">

            <div className="auth-heading">
              <h2>Welcome Back!</h2>
              <p>
                Login to your Campus Lost and Found Portal
                account and reconnect with your belongings.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="form-label">
                  College Email
                </label>

                <div className="auth-input">
                  <Mail size={19} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your college email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <div className="auth-input">
                  <Lock size={19} />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-danger">
                  {error}
                </p>
              )}

              <div className="forgot-password">
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn auth-submit w-100"
              >
                Login
              </button>

            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Create Account</Link>
            </p>

            <div className="text-center mt-3 pt-2 border-top" style={{ fontSize: '0.85rem' }}>
              <span className="text-muted">Are you a staff or administrator? </span>
              <Link to="/admin/login" className="text-primary fw-semibold text-decoration-none">
                Admin Login
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Login;
