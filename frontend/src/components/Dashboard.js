import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainWorkspace from './MainWorkspace';
import YourFiles from './YourFiles';
import DuplicateFiles from './DuplicateFiles';
import RecentFiles from './RecentFiles';
import UploadModal from './UploadModal';
import './Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <MainWorkspace 
          onOpenUpload={() => setIsUploadModalOpen(true)} 
          refreshTrigger={refreshTrigger} 
          setActivePage={setActivePage}
        />;
      case 'your-files':
        return <YourFiles refreshTrigger={refreshTrigger} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />;
      case 'duplicate-files':
        return <DuplicateFiles refreshTrigger={refreshTrigger} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />;
      case 'recent-files':
        return <RecentFiles refreshTrigger={refreshTrigger} />;
      default:
        return <MainWorkspace />;
    }
  };

  return (
    <div className="dashboard">
      {/* Animated Background Elements Matching Landing Page */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="noise-overlay"></div>
      <div className="grid-overlay"></div>

      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />
      
      <div className="main-content">
        {renderContent()}
      </div>

      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
