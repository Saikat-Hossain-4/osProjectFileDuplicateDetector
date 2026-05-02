import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Copy, Clock, UploadCloud, LogOut, ChevronUp } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, onOpenUpload }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logo}>
          FM
        </div>
        <h1 style={styles.logoText}>File Manager</h1>
      </div>

      <button 
        style={styles.uploadBtn} 
        onClick={onOpenUpload}
      >
        <UploadCloud size={20} />
        <span>Upload File</span>
      </button>

      <nav style={styles.nav}>
        {menuItems.map(item => (
          <div 
            key={item.id}
            style={{
              ...styles.navItem,
              ...(activePage === item.id ? styles.navItemActive : {})
            }}
            onClick={() => setActivePage(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={styles.profileSection}>
        {isProfileOpen && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <div style={styles.dropdownEmail}>{user.email}</div>
            </div>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
        
        <div 
          style={styles.profileToggle} 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div style={styles.avatar}>
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.username}>{user.email?.split('@')[0]}</span>
          </div>
          <ChevronUp size={16} style={{ 
            color: '#718096', 
            transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    zIndex: 10
  },
  logoContainer: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0
  },
  uploadBtn: {
    margin: '0 20px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  nav: {
    flex: 1,
    padding: '0 10px',
    overflowY: 'auto'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    margin: '4px 0',
    borderRadius: '8px',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  navItemActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea'
  },
  profileSection: {
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
    position: 'relative'
  },
  profileToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#764ba2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  userInfo: {
    flex: 1,
    overflow: 'hidden'
  },
  username: {
    display: 'block',
    fontWeight: '600',
    color: '#2d3748',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  dropdown: {
    position: 'absolute',
    bottom: '80px',
    left: '20px',
    right: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  dropdownHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f7fafc'
  },
  dropdownEmail: {
    fontSize: '13px',
    color: '#718096',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: 'none',
    color: '#e53e3e',
    cursor: 'pointer',
    fontWeight: '500',
    textAlign: 'left'
  }
};

export default Sidebar;
