import apiClient from './apiClient.js';

/**
 * Account API
 */
export const getAccounts = () => {
 return apiClient.get('/api/accounts');
};

export default { getAccounts };