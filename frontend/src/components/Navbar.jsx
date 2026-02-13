import React from 'react';

export default function Navbar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'report', label: 'Report Outage' },
    { id: 'dashboard', label: 'Live Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
    { id: 'impact', label: 'Impact' }
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-600 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Public Service Tracker</h1>
          </div>
        </div>
        
        <div className="flex space-x-1 pb-2 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                currentView === item.id
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
