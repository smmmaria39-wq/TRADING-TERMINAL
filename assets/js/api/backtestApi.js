import apiClient from './apiClient.js';

/**
 * Backtesting API
 */
export const runBacktest = (config) => {
 return apiClient.post('/api/backtest', config);
};

export const getBacktestResult = (id) => {
 return apiClient.get(`/api/backtest/${encodeURIComponent(id)}`);
};

export default { runBacktest, getBacktestResult };