import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function OutageList() {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [restoring, setRestoring] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    fetchOutages();
  }, [filter]);

  const fetchOutages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const statusFilter = filter === 'all' ? null : filter;
      const data = await api.getOutages(statusFilter);
      setOutages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setRestoring(id);
    
    try {
      await api.restoreOutage(id);
      fetchOutages();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (id) => {
    if (!adminPassword) {
      alert('Please enter admin password');
      return;
    }

    try {
      await api.deleteOutage(id, adminPassword);
      setShowDeleteModal(null);
      setAdminPassword('');
      fetchOutages();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'ongoing') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
          🔴 ONGOING
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
        ✅ RESOLVED
      </span>
    );
  };

  const getConfidenceBadge = (level) => {
    const styles = {
      unverified: 'bg-gray-100 text-gray-800',
      likely: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 ${styles[level]} text-xs font-medium rounded`}>
        {level.toUpperCase()}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Live Outage Dashboard</h2>
          <button
            onClick={fetchOutages}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          {['all', 'ongoing', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {outages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No outages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {outages.map((outage) => (
              <div
                key={outage._id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {outage.service}
                      </h3>
                      {getStatusBadge(outage.status)}
                      {getConfidenceBadge(outage.confidenceLevel)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Area:</span> {outage.area}
                      </div>
                      <div>
                        <span className="font-medium">Started:</span> {formatDate(outage.downTime)}
                      </div>
                      <div>
                        <span className="font-medium">Confirmations:</span> {outage.confirmCount}
                      </div>
                      {outage.status === 'resolved' && (
                        <>
                          <div>
                            <span className="font-medium">Restored:</span> {formatDate(outage.upTime)}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {formatDuration(outage.durationMinutes)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {outage.status === 'ongoing' && (
                      <button
                        onClick={() => handleRestore(outage._id)}
                        disabled={restoring === outage._id}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
                      >
                        {restoring === outage._id ? 'Restoring...' : 'Mark Restored'}
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteModal(outage._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Admin Delete</h3>
            <p className="text-gray-600 mb-4">Enter admin password to delete this outage:</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(null);
                  setAdminPassword('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
