import axios from 'axios';

// Use a relative path to leverage the Vite proxy.
const API_URL = '/api/admin/';

// Get all users (Admin only)
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'users', config);
  return response.data;
};

// Get system stats (Admin only)
const getStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

const adminService = {
  getUsers,
  getStats,
};

export default adminService;
