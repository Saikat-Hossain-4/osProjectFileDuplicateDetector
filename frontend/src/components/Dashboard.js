import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainWorkspace from './MainWorkspace';
import YourFiles from './YourFiles';
import DuplicateFiles from './DuplicateFiles';
import RecentFiles from './RecentFiles';
import UploadModal from './UploadModal';

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
    <div style={styles.container}>
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />
      
      <div style={styles.mainContent}>
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

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '30px',
    position: 'relative'
  }
};

export default Dashboard;
