import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ADDED: framer-motion import
import './LandingPage.css';

// ADDED: Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const cardHover = {
  hover: { 
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

function LandingPage() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

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

  const handleNavigation = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      navigate(path);
    }, 1200); // Wait 1.2s before navigating
  };

  const handleGetStarted = () => {
    handleNavigation('/login');
  };

  const handleLogin = () => {
    handleNavigation('/login');
  };

  return (
    <div className="landing-page">
      {/* ADDED: Background animated elements */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="noise-overlay"></div>
      <div className="grid-overlay"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={fadeUp}>
            Manage Your Files
            <span className="gradient-text glow-text"> Smarter</span>
            <div className="animated-underline"></div>
          </motion.h1>
          <motion.p className="hero-description" variants={fadeUp}>
            Experience the ultimate file management solution with advanced duplicate detection,
            smart organization, and seamless cloud storage. Perfect for professionals and teams.
          </motion.p>
          <motion.div className="hero-buttons" variants={fadeUp}>
            <motion.button 
              className="btn-primary" 
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(102, 126, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button 
              className="btn-secondary" 
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
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
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features for
            <span className="gradient-text glow-text"> Modern File Management</span>
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to manage your files efficiently in one place
          </motion.p>
          
          <motion.div 
            className="features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card glass-card"
                variants={fadeUp}
                whileHover="hover"
                custom={index}
              >
                <div className="feature-card-inner">
                  <motion.div 
                    className="feature-icon"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            How It
            <span className="gradient-text glow-text"> Works</span>
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Get started in three simple steps
          </motion.p>
          
          <div className="steps-container">
            {[
              { num: 1, icon: '📤', title: 'Upload Your Files', desc: 'Drag and drop or click to upload your files securely to the cloud' },
              { num: 2, icon: '🔍', title: 'Automatic Scanning', desc: 'Our system automatically scans and detects duplicate files' },
              { num: 3, icon: '🎯', title: 'Manage Efficiently', desc: 'Organize, search, and manage your files with powerful tools' }
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div 
                  className="step glass-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.2, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="step-number gradient-badge">{step.num}</div>
                  <motion.div 
                    className="step-icon"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.2 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.desc}</p>
                </motion.div>
                {idx < 2 && (
                  <motion.div 
                    className="step-arrow"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 0.5, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx + 0.5) * 0.2 }}
                  >
                    →
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Why Choose
            <span className="gradient-text glow-text"> Us</span>
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Experience the difference with our premium file management solution
          </motion.p>
          
          <motion.div 
            className="benefits-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="benefit-card glass-card"
                variants={fadeUp}
                whileHover="hover"
              >
                <motion.div 
                  className="benefit-icon"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section parallax-bg">
        <motion.div 
          className="cta-content glass-card cta-glow-border"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="cta-title">
            Ready to Simplify Your File Management?
          </h2>
          <p className="cta-description">
            Join thousands of users who trust us with their files
          </p>
          <motion.button 
            className="btn-primary cta-button pulse-btn" 
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Managing Files Now
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer footer-gradient-border">
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
              <li><a href="#features" className="hover-underline">Features</a></li>
              <li><a href="#how-it-works" className="hover-underline">How it Works</a></li>
              <li><a href="#pricing" className="hover-underline">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about" className="hover-underline">About Us</a></li>
              <li><a href="#blog" className="hover-underline">Blog</a></li>
              <li><a href="#careers" className="hover-underline">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help" className="hover-underline">Help Center</a></li>
              <li><a href="#contact" className="hover-underline">Contact Us</a></li>
              <li><a href="#privacy" className="hover-underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FileManager. All rights reserved.</p>
        </div>
      </footer>

      {/* Fullscreen Loading Animation */}
      {isNavigating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(11, 15, 26, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <style>{`
            .loader {
              display: flex;
              gap: 12px;
              justify-content: center;
              align-items: center;
            }
            .loader span {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, #00d4ff, #8b5cf6);
              animation: blob-bounce 1.4s infinite ease-in-out both;
            }
            .loader span:nth-child(1) {
              animation-delay: -0.32s;
            }
            .loader span:nth-child(2) {
              animation-delay: -0.16s;
            }
            @keyframes blob-bounce {
              0%, 80%, 100% {
                transform: scale(0.4) translateY(0);
                opacity: 0.6;
              }
              40% {
                transform: scale(1) translateY(-12px);
                opacity: 1;
              }
            }
          `}</style>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '24px', color: 'white', fontSize: '20px', fontWeight: '500' }}
          >
            Taking you there...
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}

export default LandingPage;
