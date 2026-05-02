import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: '📤',
      title: 'Easy File Upload',
      description: 'Drag & drop or click to upload files instantly. Support for images, PDFs, and Word documents.'
    },
    {
      icon: '🔄',
      title: 'Duplicate Detection',
      description: 'Automatically detect and manage duplicate files to keep your storage clean and organized.'
    },
    {
      icon: '📁',
      title: 'Smart Organization',
      description: 'Files are automatically grouped by type and sorted alphabetically for easy access.'
    },
    {
      icon: '🔍',
      title: 'Powerful Search',
      description: 'Quickly find any file with our fast search functionality and recent files tracking.'
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance with instant file access and quick uploads.'
    },
    {
      icon: '🔒',
      title: 'Secure Storage',
      description: 'Your files are safely stored in the cloud with enterprise-grade security.'
    },
    {
      icon: '🌐',
      title: 'Access Anywhere',
      description: 'Access your files from any device, anywhere in the world.'
    },
    {
      icon: '💾',
      title: 'Cloud Backup',
      description: 'Automatic cloud backup ensures your files are never lost.'
    }
  ];

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Your Files
            <span className="gradient-text"> Smarter</span>
          </h1>
          <p className="hero-description">
            Experience the ultimate file management solution with advanced duplicate detection,
            smart organization, and seamless cloud storage. Perfect for professionals and teams.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started Free
            </button>
            <button className="btn-secondary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">5000+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Files Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            Powerful Features for
            <span className="gradient-text"> Modern File Management</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to manage your files efficiently in one place
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">
            How It
            <span className="gradient-text"> Works</span>
          </h2>
          <p className="section-subtitle">
            Get started in three simple steps
          </p>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">📤</div>
              <h3 className="step-title">Upload Your Files</h3>
              <p className="step-description">Drag and drop or click to upload your files securely to the cloud</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">🔍</div>
              <h3 className="step-title">Automatic Scanning</h3>
              <p className="step-description">Our system automatically scans and detects duplicate files</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">🎯</div>
              <h3 className="step-title">Manage Efficiently</h3>
              <p className="step-description">Organize, search, and manage your files with powerful tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">
            Why Choose
            <span className="gradient-text"> Us</span>
          </h2>
          <p className="section-subtitle">
            Experience the difference with our premium file management solution
          </p>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Simplify Your File Management?
          </h2>
          <p className="cta-description">
            Join thousands of users who trust us with their files
          </p>
          <button className="btn-primary cta-button" onClick={handleGetStarted}>
            Start Managing Files Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">FileManager</h3>
            <p className="footer-description">
              Smart file management solution for modern users
            </p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FileManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
