
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserRound,
  Mail,
  Lock,
  IdCard,
  Eye,
  EyeOff
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Auth.css';

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(
      localStorage.getItem('campusUsers') || '[]'
    );

    const emailExists = existingUsers.some(
      (user) => user.email.toLowerCase() === formData.email.trim().toLowerCase()
    );

    if (emailExists) {
      alert('This email is already registered. Please login.');
      return;
    }

    const newUser = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      studentId: formData.studentId.trim(),
      department: formData.department,
      password: formData.password
    };

    existingUsers.push(newUser);

    localStorage.setItem(
      'campusUsers',
      JSON.stringify(existingUsers)
    );

    alert('Registration successful! Please login.');

    navigate('/login');
  };

  return (
    <>
      <Navbar />

      <section className="auth-section">
        <div className="container">
          <div className="auth-card">

            <div className="auth-heading">
              <h2>Create Your Account</h2>
              <p>
                Join Campus Lost and Found Portal and help reconnect lost belongings.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <div className="auth-input">
                  <UserRound size={19} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">College Email</label>
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
                <label className="form-label">Student ID</label>
                <div className="auth-input">
                  <IdCard size={19} />
                  <input
                    type="text"
                    name="studentId"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="IT Engineering">IT Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="auth-input">
                  <Lock size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
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

              <div className="mb-4">
                <label className="form-label">Confirm Password</label>
                <div className="auth-input">
                  <Lock size={19} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn auth-submit w-100">
                Create Account
              </button>

            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Register;
