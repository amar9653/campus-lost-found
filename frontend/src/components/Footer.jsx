
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row g-4">

          {/* Brand Information */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="footer-brand">
              <span>Campus</span>
              <span>Lost & Found</span>
            </Link>

            <p className="footer-description">
              A smart campus lost and found portal
              that helps students and staff reconnect
              with their lost belongings.
            </p>

            {/* Social Media Links */}
            <div className="footer-social">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>

            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Account</h5>

            <ul className="footer-links">
              <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/admin/login">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h5>Contact Information</h5>

            <div className="footer-contact">
              <MapPin size={18} />
              <span>College Campus</span>
            </div>

            <div className="footer-contact">
              <Mail size={18} />
              <span>support@campusfind.com</span>
            </div>

            <div className="footer-contact">
              <Phone size={18} />
              <span>Contact support team</span>
            </div>
          </div>

        </div>

        <hr className="footer-divider" />

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Campus Lost and Found Portal.
            All Rights Reserved.
          </p>

          <p>
            Made for a safer and smarter campus.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
