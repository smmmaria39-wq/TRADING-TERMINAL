import apiClient from './apiClient.js';

/**
 * Signal API
 */
export const getSignals = () => {
 return apiClient.get('/api/signals');
};

export const getSignalById = (id) => {
 return apiClient.get(`/api/signals/${encodeURIComponent(id)}`);
};

export default { getSignals, getSignalById };