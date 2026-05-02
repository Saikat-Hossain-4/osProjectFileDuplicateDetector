import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Copy, Clock, UploadCloud, LogOut, ChevronUp, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ activePage, setActivePage, onOpenUpload }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'your-files', label: 'Your Files', icon: <Folder size={20} /> },
    { id: 'recent-files', label: 'Recent Files', icon: <Clock size={20} /> },
    { id: 'duplicate-files', label: 'Duplicate Files', icon: <Copy size={20} /> }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>File Manager</h2>
      </div>

      <button 
        className="upload-btn" 
        onClick={onOpenUpload}
      >
        <UploadCloud size={20} />
        <span>Upload File</span>
      </button>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isProfileOpen && (
          <div className="profile-dropdown">
            <div className="profile-email">{user.email}</div>
            
            <div className="theme-toggle-container">
              <span>Theme</span>
              <div 
                className={`theme-switch ${theme}`} 
                onClick={toggleTheme}
              >
                <div className="switch-slider">
                  {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} color="#f59e0b" />}
                </div>
              </div>
            </div>

            <button className="logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
        
        <div 
          className="user-profile" 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-email">
            {user.name || user.email?.split('@')[0]}
          </div>
          <ChevronUp size={16} style={{ 
            transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
        </div>
      </div>

      <AnimatePresence>
        {isLogoutModalOpen && (
          <motion.div 
            className="logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="logout-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3>Logout Confirmation</h3>
              <p>Are you sure you want to logout?</p>
              <div className="modal-actions">
                <button className="modal-btn cancel" onClick={() => setIsLogoutModalOpen(false)}>
                  Cancel
                </button>
                <button className="modal-btn confirm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
