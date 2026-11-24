
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../styles/Auth.css';

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    try {
      const response = await axios.post(
        '/api/auth/login',
        { email, password }
      );

      const user = response.data?.data;

      if (
        !response.data?.success ||
        user?.role !== 'admin' ||
        !user?.token
      ) {
        setError('Access denied. Administrator account required.');
        return;
      }

      localStorage.setItem('adminToken', user.token);

      navigate('/admin/dashboard', { replace: true });

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to sign in. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="auth-section">
        <div className="container">
          <div
            className="auth-card login-card"
            style={{ maxWidth: '460px' }}
          >
            <div className="text-center mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#EBF3FE',
                  color: '#1B5CE2'
                }}
              >
                <ShieldCheck size={30} />
              </div>

              <h2
                className="fw-bold"
                style={{ color: '#0B1E38' }}
              >
                Admin Portal
              </h2>

              <p
                className="text-muted"
                style={{ fontSize: '0.9rem' }}
              >
                Sign in with authorized administrator credentials
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: '0.85rem' }}
                >
                  Admin Email
                </label>

                <div className="auth-input">
                  <Mail size={19} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter admin email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: '0.85rem' }}
                >
                  Password
                </label>

                <div className="auth-input">
                  <Lock size={19} />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="alert alert-danger py-2 px-3 mb-3"
                  role="alert"
                  style={{ fontSize: '0.85rem' }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn auth-submit w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  backgroundColor: '#0B1E38',
                  borderColor: '#0B1E38',
                  color: '#FFFFFF',
                  padding: '12px',
                  fontWeight: 600
                }}
              >
                {loading ? (
                  'Signing In...'
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div
              className="text-center mt-3"
              style={{ fontSize: '0.85rem' }}
            >
              <span className="text-muted">
                Not an administrator?{' '}
              </span>

              <Link
                to="/login"
                className="text-primary text-decoration-none fw-semibold"
              >
                Go to Student Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AdminLogin;
