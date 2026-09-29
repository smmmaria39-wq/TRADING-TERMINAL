import apiClient from './apiClient.js';

/**
 * Trade & Order API
 */
export const getTrades = () => {
 return apiClient.get('/api/trades');
};

export const createTrade = (orderPayload) => {
 return apiClient.post('/api/trades', orderPayload);
};

export const getTradeById = (id) => {
 return apiClient.get(`/api/trades/${encodeURIComponent(id)}`);
};

export default { getTrades, createTrade, getTradeById };