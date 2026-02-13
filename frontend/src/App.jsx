import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ReportOutageForm from './components/ReportOutageForm';
import OutageList from './components/OutageList';
import Analytics from './components/Analytics';
import Insights from './components/Insights';
import Impact from './components/Impact';

function App() {
  const [currentView, setCurrentView] = useState('report');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOutageReported = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="container mx-auto px-4 py-8">
        {currentView === 'report' && (
          <ReportOutageForm onOutageReported={handleOutageReported} />
        )}
        
        {currentView === 'dashboard' && (
          <OutageList key={refreshTrigger} />
        )}
        
        {currentView === 'analytics' && (
          <Analytics />
        )}
        
        {currentView === 'insights' && (
          <Insights />
        )}
        
        {currentView === 'impact' && (
          <Impact />
        )}
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Public Service Downtime Tracker | Community-powered outage reporting
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
