
import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  PackageSearch
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Search items
  const handleSearch = (e) => {
    e.preventDefault();

    navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
  };

  // Browse category
  const handleCategoryClick = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const categories = [
    {
      name: 'Electronics',
      icon: '💻',
      description: 'Phones, laptops'
    },
    {
      name: 'Bags',
      icon: '🎒',
      description: 'Backpacks, purses'
    },
    {
      name: 'ID Cards',
      icon: '🪪',
      description: 'College ID cards'
    },
    {
      name: 'Keys',
      icon: '🔑',
      description: 'Room and locker keys'
    },
    {
      name: 'Books',
      icon: '📚',
      description: 'Books and notebooks'
    },
    {
      name: 'Accessories',
      icon: '⌚',
      description: 'Watches and more'
    }
  ];

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">

            {/* Left Content */}
            <div className="col-lg-6">
              <span className="hero-badge">
                <PackageSearch size={16} />
                Campus Lost & Found Portal
              </span>

              <h1 className="hero-title">
                Lost Something?
                <br />
                <span>Let's Find It Together.</span>
              </h1>

              <p className="hero-description">
                A simple and trusted platform for students and staff
                to report lost belongings, discover found items and
                reconnect people with their valuables.
              </p>

              {/* Search Bar */}
              <form className="hero-search" onSubmit={handleSearch}>
                <Search size={21} />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for keys, bags, ID cards..."
                />

                <button type="submit">
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div className="hero-buttons">
                <Link to="/login" className="btn btn-primary btn-lg">
                  Report Lost Item
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-lg"
                >
                  Report Found Item
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="col-lg-6">
              <div className="hero-image-wrapper">
                <img
                  src="/hero.jpg"
                  alt="Student walking on a college campus"
                  className="hero-image"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">

          <div className="section-heading text-center">
            <span className="section-badge">Simple Process</span>

            <h2>
              How <span>Campus Lost and Found Portal</span> Works
            </h2>

            <p>
              Recovering your lost belongings is simple.
              Follow these four easy steps.
            </p>
          </div>

          <div className="row g-4 mt-4">

            <div className="col-md-6 col-lg-3">
              <div className="process-card">
                <div className="process-icon">01</div>
                <h4>Report an Item</h4>
                <p>
                  Report your lost or found belongings
                  by providing item details.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="process-card">
                <div className="process-icon">02</div>
                <h4>Search Items</h4>
                <p>
                  Browse available found items and
                  search using keywords or categories.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="process-card">
                <div className="process-icon">03</div>
                <h4>Submit a Claim</h4>
                <p>
                  If you find your belonging, log in
                  and submit a claim for verification.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="process-card">
                <div className="process-icon">04</div>
                <h4>Get It Back</h4>
                <p>
                  After successful verification,
                  reconnect with your belongings.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Browse Categories Section */}
      <section className="categories-section" id="categories">
        <div className="container">

          <div className="section-heading text-center">
            <span className="section-badge">Explore Items</span>

            <h2>
              Browse By <span>Categories</span>
            </h2>

            <p>
              Find your lost belongings by exploring
              different item categories.
            </p>
          </div>

          <div className="row g-4 mt-4">

            {categories.map((category) => (
              <div
                className="col-6 col-md-4 col-lg-2"
                key={category.name}
              >
                <button
                  type="button"
                  className="category-card w-100 border-0"
                  onClick={() => handleCategoryClick(category.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="category-icon">
                    {category.icon}
                  </div>

                  <h5>{category.name}</h5>
                  <p>{category.description}</p>
                </button>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section" id="contact">
        <div className="container">

          <div className="section-heading text-center">
            <span className="section-badge">Get In Touch</span>

            <h2>
              Contact <span>Us</span>
            </h2>

            <p>
              Have questions or need help? We are here
              to help you with your lost and found items.
            </p>
          </div>

          <div className="row g-4 mt-4 align-items-stretch">

            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="contact-info-card">
                <h3>Let's Connect</h3>

                <p>
                  Get in touch with the Campus Lost and Found Portal
                  team for assistance and enquiries.
                </p>

                <div className="contact-detail">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <h6>Email</h6>
                    <p>support@campusfind.com</p>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h6>Location</h6>
                    <p>College Campus</p>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="contact-icon">🕒</div>
                  <div>
                    <h6>Support Hours</h6>
                    <p>Monday - Saturday</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="contact-form-card">
                <h3>Send Us a Message</h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    alert(
                      'Thank you! Your message form is ready for backend integration.'
                    );

                    e.target.reset();
                  }}
                >

                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter subject"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Write your message..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
