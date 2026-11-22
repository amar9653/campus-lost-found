
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container">

        {/* Website Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <span className="brand-campus">Campus</span>
          <span className="brand-find"> Lost & Found</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">

          <ul className="navbar-nav mx-auto gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                How It Works
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#categories">
                Categories
              </a>
            </li>
          </ul>

          {/* Login and Register Buttons */}
          <div className="d-flex gap-2 align-items-center">

            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              <UserRound size={17} className="me-1" />
              Register
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
