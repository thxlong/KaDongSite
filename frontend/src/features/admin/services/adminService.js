/**
 * Admin Service
 * 
 * API calls cho admin dashboard
 * Base URL: /api/admin
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/admin`;

/**
 * Helper function to make API calls with fetch
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// ============================================
// Dashboard APIs
// ============================================

export const getDashboardStats = async () => {
  const response = await fetchAPI('/dashboard/stats');
  return response.data;
};

export const getActivityChart = async (days = 30) => {
  const response = await fetchAPI(`/dashboard/activity-chart?days=${days}`);
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await fetchAPI('/system/health');
  return response.data;
};

// ============================================
// User Management APIs
// ============================================

export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/users?${queryString}` : '/users';
  const response = await fetchAPI(endpoint);
  return response.data;
};

export const getUser = async (id) => {
  const response = await fetchAPI(`/users/${id}`);
  return response.data.user;
};

export const createUser = async (userData) => {
  const response = await fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return response.data.user;
};

export const updateUser = async (id, userData) => {
  const response = await fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
  return response.data.user;
};

export const deleteUser = async (id) => {
  const response = await fetchAPI(`/users/${id}`, {
    method: 'DELETE'
  });
  return response;
};

export const lockUser = async (id, reason) => {
  const response = await fetchAPI(`/users/${id}/lock`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
  return response.data.user;
};

export const unlockUser = async (id) => {
  const response = await fetchAPI(`/users/${id}/unlock`, {
    method: 'POST'
  });
  return response.data.user;
};

export const resetPassword = async (id, newPassword) => {
  const response = await fetchAPI(`/users/${id}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword })
  });
  return response;
};

export const getUserSessions = async (id) => {
  const response = await fetchAPI(`/users/${id}/sessions`);
  return response.data.sessions;
};

export const revokeSession = async (userId, sessionId) => {
  const response = await fetchAPI(`/users/${userId}/sessions/${sessionId}`, {
    method: 'DELETE'
  });
  return response;
};

// ============================================
// Role Management APIs
// ============================================

export const getRoles = async () => {
  const response = await fetchAPI('/roles');
  return response.data.roles;
};

export const getRole = async (id) => {
  const response = await fetchAPI(`/roles/${id}`);
  return response.data;
};

export const createRole = async (roleData) => {
  const response = await fetchAPI('/roles', {
    method: 'POST',
    body: JSON.stringify(roleData)
  });
  return response.data.role;
};

export const updateRole = async (id, roleData) => {
  const response = await fetchAPI(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roleData)
  });
  return response.data.role;
};

export const deleteRole = async (id) => {
  const response = await fetchAPI(`/roles/${id}`, {
    method: 'DELETE'
  });
  return response;
};

export const assignRole = async (userId, roleId) => {
  const response = await fetchAPI(`/users/${userId}/roles/${roleId}`, {
    method: 'POST'
  });
  return response;
};

export const removeRole = async (userId, roleId) => {
  const response = await fetchAPI(`/users/${userId}/roles/${roleId}`, {
    method: 'DELETE'
  });
  return response;
};

export const getPermissions = async () => {
  const response = await fetchAPI('/permissions');
  return response.data.permissions;
};

// ============================================
// Security Management APIs
// ============================================

export const getAlerts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/security/alerts?${queryString}` : '/security/alerts';
  const response = await fetchAPI(endpoint);
  return response.data;
};

export const getAlertStats = async () => {
  const response = await fetchAPI('/security/alerts/stats');
  return response.data.stats;
};

export const reviewAlert = async (id) => {
  const response = await fetchAPI(`/security/alerts/${id}/review`, {
    method: 'POST'
  });
  return response.data.alert;
};

export const reviewAllAlerts = async () => {
  const response = await fetchAPI('/security/alerts/review-all', {
    method: 'POST'
  });
  return response;
};

export const getBlockedIPs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/security/blocked-ips?${queryString}` : '/security/blocked-ips';
  const response = await fetchAPI(endpoint);
  return response.data;
};

export const blockIP = async (ipData) => {
  const response = await fetchAPI('/security/blocked-ips', {
    method: 'POST',
    body: JSON.stringify(ipData)
  });
  return response.data.blocked_ip;
};

export const unblockIP = async (id) => {
  const response = await fetchAPI(`/security/blocked-ips/${id}`, {
    method: 'DELETE'
  });
  return response;
};

export const updateBlockedIP = async (id, ipData) => {
  const response = await fetchAPI(`/security/blocked-ips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ipData)
  });
  return response.data.blocked_ip;
};

export const cleanupExpiredBlocks = async () => {
  const response = await fetchAPI('/security/cleanup-expired', {
    method: 'POST'
  });
  return response;
};

// ============================================
// Audit Log APIs
// ============================================

export const getAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/audit-logs?${queryString}` : '/audit-logs';
  const response = await fetchAPI(endpoint);
  return response.data;
};

export const getAuditLog = async (id) => {
  const response = await fetchAPI(`/audit-logs/${id}`);
  return response.data.log;
};

export const getUserAuditLogs = async (userId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/audit-logs/user/${userId}?${queryString}` : `/audit-logs/user/${userId}`;
  const response = await fetchAPI(endpoint);
  return response.data;
};

export const exportAuditLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/audit-logs/export?${queryString}` : '/audit-logs/export';
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    // Get blob from response
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `audit-logs-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

// Export as default object
const adminService = {
  // Dashboard
  getDashboardStats,
  getActivityChart,
  getSystemHealth,
  
  // Users
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  lockUser,
  unlockUser,
  resetPassword,
  getUserSessions,
  revokeSession,
  
  // Roles
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignRole,
  removeRole,
  getPermissions,
  
  // Security
  getAlerts,
  getAlertStats,
  reviewAlert,
  reviewAllAlerts,
  getBlockedIPs,
  blockIP,
  unblockIP,
  updateBlockedIP,
  cleanupExpiredBlocks,
  
  // Audit Logs
  getAuditLogs,
  getAuditLog,
  getUserAuditLogs,
  exportAuditLogs
};

export { adminService };
