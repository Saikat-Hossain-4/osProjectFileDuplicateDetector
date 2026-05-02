import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Copy, Clock, UploadCloud, LogOut, ChevronUp } from 'lucide-react';
import './Sidebar.css';

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
            <button className="logout-btn" onClick={handleLogout}>
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
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-email">
            {user.email?.split('@')[0]}
          </div>
          <ChevronUp size={16} style={{ 
            transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
