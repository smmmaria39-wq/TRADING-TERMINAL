import apiClient from './apiClient.js';

export const getMarketAnalysis = (symbol, timeframe = 'M15') => {
 if (!symbol) return Promise.reject(new Error('Symbol is required'));
 return apiClient.get(`/api/analysis?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(timeframe)}`);
};