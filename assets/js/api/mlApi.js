import apiClient from './apiClient.js';

/**
 * Machine Learning API
 */
export const getMlStatus = () => {
 return apiClient.get('/api/ml/status');
};

export const trainModels = () => {
 return apiClient.post('/api/ml/train');
};

export const getMlPredictions = (symbol) => {
 return apiClient.get(`/api/ml/predictions?symbol=${encodeURIComponent(symbol)}`);
};

export default { getMlStatus, trainModels, getMlPredictions };