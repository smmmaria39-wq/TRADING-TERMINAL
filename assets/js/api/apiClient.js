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
    window.location.href = '../login.html';
    throw new Error('Unauthorized');
   }
   
   if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
   }
   
   return response.json();
  } catch (error) {
   console.error(`[API] Request failed for ${endpoint}:`, error.message);
   throw error;
  }
 }
 
 get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
 post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
}

export default new ApiClient();