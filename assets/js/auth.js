import CONFIG from './config.js';

export async function checkAuthState() {
  const token = localStorage.getItem('authToken');
  const path = window.location.pathname;
 
  if (!token) {
    // Prevent redirect loop if already on login or index
    if (!path.includes('login.html') && !path.includes('index.html')) {
      // Fix relative path based on current location
      const isRoot = path.endsWith('/');
      const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '');
      window.location.href = baseUrl + 'login.html';
    }
    return false;
  }
  return true;
}

export async function login(email, password) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      let errorMessage = 'Login failed.';
      if (response.status === 401) errorMessage = 'Invalid email or password.';
      else if (response.status >= 500) errorMessage = 'The trading server encountered an error.';
      else {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) { /* Keep default error */ }
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    if (!data.token) throw new Error('Authentication server returned an invalid response.');
    
    localStorage.setItem('authToken', data.token);
    return true;
  } catch (error) {
    console.error('Login failed:', error.message);
    if (error.message === 'Failed to fetch' || error.message === 'Load failed') {
      throw new Error('Unable to connect to the trading server.');
    }
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('authToken');
  const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '');
  window.location.href = baseUrl + 'login.html';
}

export default { checkAuthState, login, logout };
