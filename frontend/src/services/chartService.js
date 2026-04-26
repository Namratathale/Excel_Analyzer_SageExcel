import axios from 'axios';

// Use a relative path to leverage the Vite proxy.
const API_URL = `${import.meta.env.VITE_API_URL}/api/charts/`;
// Saves a new chart configuration
const saveChart = async (chartData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'save', chartData, config);
  return response.data;
};

// Gets all saved charts for the user
const getCharts = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Deletes a saved chart by its ID
const deleteChart = async (chartId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(API_URL + chartId, config);
  return response.data;
};

const chartService = {
  saveChart,
  getCharts,
  deleteChart,
};

export default chartService;
