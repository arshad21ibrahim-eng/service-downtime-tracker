import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          <button
            onClick={fetchStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{stats.totalOutages}</div>
            <div className="text-blue-100">Total Outages</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{stats.ongoingOutages}</div>
            <div className="text-red-100">Active Now</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{stats.resolvedOutages}</div>
            <div className="text-green-100">Resolved</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">{stats.avgResolutionTime}m</div>
            <div className="text-purple-100">Avg. Resolution</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Breakdown</h3>
            {stats.serviceBreakdown.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {stats.serviceBreakdown.map((service) => (
                  <div key={service._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-700">{service._id}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Total: <span className="font-semibold">{service.count}</span>
                      </span>
                      {service.ongoing > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                          {service.ongoing} active
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Affected Areas</h3>
            {stats.areaBreakdown.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {stats.areaBreakdown.map((area, index) => (
                  <div key={area._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-700">{area._id}</span>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded">
                      {area.count} outages
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
