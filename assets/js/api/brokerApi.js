import apiClient from './apiClient.js';

/**
 * Broker API
 */
export const getBrokers = () => {
 return apiClient.get('/api/brokers');
};

export const getBrokerAccounts = () => {
 return apiClient.get('/api/brokers/accounts');
};

export const connectBroker = (brokerName, credentials) => {
 return apiClient.post('/api/brokers/connect', { brokerName, credentials });
};

export const disconnectBroker = (brokerName) => {
 return apiClient.post('/api/brokers/disconnect', { brokerName });
};

export default { getBrokers, getBrokerAccounts, connectBroker, disconnectBroker };