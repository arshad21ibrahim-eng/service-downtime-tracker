const API_BASE = "http://localhost:5000/api";

export const api = {
  // Report new outage
  reportOutage: async (service, area) => {
    const response = await fetch(`${API_BASE}/outages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ service, area })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to report outage');
    }
    
    return response.json();
  },

  // Get all outages
  getOutages: async (status = null) => {
    const url = status ? `${API_BASE}/outages?status=${status}` : `${API_BASE}/outages`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch outages');
    }
    
    return response.json();
  },

  // Restore service
  restoreOutage: async (id) => {
    const response = await fetch(`${API_BASE}/outages/${id}/restore`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to restore service');
    }
    
    return response.json();
  },

  // Get analytics stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/outages/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  },

  // Get insights
  getInsights: async () => {
    const response = await fetch(`${API_BASE}/outages/insights`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    
    return response.json();
  },

  // Get impact metrics
  getImpact: async () => {
    const response = await fetch(`${API_BASE}/outages/impact`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch impact');
    }
    
    return response.json();
  },

  // Delete outage (admin only)
  deleteOutage: async (id, adminPassword) => {
    const response = await fetch(`${API_BASE}/outages/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': adminPassword
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete outage');
    }
    
    return response.json();
  }
};
