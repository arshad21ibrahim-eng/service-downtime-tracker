import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Impact() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.getImpact();
      setImpact(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCrisisColor = (level) => {
    const colors = {
      'Normal': 'bg-green-500',
      'Moderate': 'bg-yellow-500',
      'High': 'bg-orange-500',
      'Critical': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getCrisisIcon = (level) => {
    if (level === 'Critical') return '🚨';
    if (level === 'High') return '⚠️';
    if (level === 'Moderate') return '⚡';
    return '✅';
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
          <h2 className="text-2xl font-bold text-gray-800">Impact Assessment</h2>
          <button
            onClick={fetchImpact}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className={`${getCrisisColor(impact.crisisLevel)} text-white rounded-lg p-8 mb-6 text-center`}>
          <div className="text-6xl mb-4">{getCrisisIcon(impact.crisisLevel)}</div>
          <div className="text-3xl font-bold mb-2">Crisis Level: {impact.crisisLevel}</div>
          <div className="text-lg opacity-90">
            {impact.ongoingCount} active {impact.ongoingCount === 1 ? 'outage' : 'outages'} currently affecting services
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="border border-red-200 bg-red-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-red-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Critical Services</h3>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">
              {impact.criticalOutages}
            </div>
            <p className="text-gray-600">
              Essential services currently affected
            </p>
            <div className="mt-4 text-sm text-gray-700">
              Includes: Electricity, Water, Healthcare, Emergency Services
            </div>
          </div>

          <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Total Downtime</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {impact.totalDowntimeHours}
            </div>
            <p className="text-gray-600">
              Hours of service disruption
            </p>
            <div className="mt-4 text-sm text-gray-700">
              Cumulative downtime across all resolved outages
            </div>
          </div>

          <div className="border border-purple-200 bg-purple-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Longest Outage</h3>
            </div>
            {impact.longestOutage ? (
              <>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.floor(impact.longestOutage.durationMinutes / 60)}h {impact.longestOutage.durationMinutes % 60}m
                </div>
                <p className="text-gray-600 mb-2">
                  {impact.longestOutage.service}
                </p>
                <div className="text-sm text-gray-700">
                  Area: {impact.longestOutage.area}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No resolved outages yet</div>
            )}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Crisis Level Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 w-4 h-4 rounded-full mt-1"></div>
              <div>
                <div className="font-semibold text-gray-800">Normal</div>
                <div className="text-sm text-gray-600">0-1 outages</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500 w-4 h-4 rounded-full mt-1"></div>
              <div>
                <div className="font-semibold text-gray-800">Moderate</div>
                <div className="text-sm text-gray-600">2-4 outages</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 w-4 h-4 rounded-full mt-1"></div>
              <div>
                <div className="font-semibold text-gray-800">High</div>
                <div className="text-sm text-gray-600">5-9 outages</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-red-500 w-4 h-4 rounded-full mt-1"></div>
              <div>
                <div className="font-semibold text-gray-800">Critical</div>
                <div className="text-sm text-gray-600">10+ outages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">📊 Community Impact</h3>
        <p className="text-blue-100 mb-4">
          This platform tracks real-time service outages to help communities stay informed and prepared. 
          Your reports contribute to a comprehensive view of service reliability in your area.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">Real-time</div>
            <div className="text-sm text-blue-100">Outage Tracking</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">Community</div>
            <div className="text-sm text-blue-100">Verified Reports</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold mb-1">Data-Driven</div>
            <div className="text-sm text-blue-100">Insights</div>
          </div>
        </div>
      </div>
    </div>
  );
}
