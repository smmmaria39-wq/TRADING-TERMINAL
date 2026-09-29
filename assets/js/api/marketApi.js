import apiClient from './apiClient.js';

/**
 * Market Data API
 */
export const getMarketData = (symbol, timeframe = 'M15') => {
 return apiClient.get(`/api/market?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(timeframe)}`);
};

export const getSymbols = () => {
 return apiClient.get('/api/market/symbols');
};

export default { getMarketData, getSymbols };