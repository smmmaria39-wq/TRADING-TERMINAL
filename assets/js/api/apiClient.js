import CONFIG from '../config.js';

class ApiClient {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        console.warn('[API] Unauthorized. Redirecting to login.');
        localStorage.removeItem('authToken');
        const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '');
        window.location.href = baseUrl + 'login.html';
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      // FIX: Safely handle empty responses (like 204 No Content or 304 Not Modified)
      if (response.status === 204 || response.status === 304) {
        return { success: true, data: [] };
      }
      
      const text = await response.text();
      // If body is empty, return a safe default object
      if (!text) return { success: true, data: [] };
      
      return JSON.parse(text);
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message === 'Load failed') {
        throw new Error('Unable to connect to the trading server.');
      }
      console.error(`[API] Request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }
 
  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
}

export default new ApiClient();
