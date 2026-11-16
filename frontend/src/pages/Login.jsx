
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../styles/Auth.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert('Login form submitted! Backend integration is pending.');

    console.log(formData);
  };

  return (
    <>
      <Navbar />

      <section className="auth-section">
        <div className="container">
          <div className="auth-card login-card">

            {/* Heading */}
            <div className="auth-heading">
              <h2>Welcome Back!</h2>
              <p>
                Login to your Campus Lost and Found Portal
                account and reconnect with your belongings.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
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

              {/* Password */}
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
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />
                    }
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="forgot-password">
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn auth-submit w-100"
              >
                Login
              </button>

            </form>

            {/* Register Link */}
            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Login;
