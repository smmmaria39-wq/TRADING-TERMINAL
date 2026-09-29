import CONFIG from './config.js';

/**
 * Authentication Module
 * Handles route protection and login/logout flows.
 */

export async function checkAuthState() {
 const token = localStorage.getItem('authToken');
 
 // If no token exists, redirect to login (if not already there)
 if (!token) {
  if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
   window.location.href = '../login.html';
  }
  return false;
 }
 
 // TODO: In production, verify token expiry with backend here.
 return true;
}

export async function login(email, password) {
 try {
  // Strict API call to backend auth endpoint
  const response = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
   const errorData = await response.json();
   throw new Error(errorData.message || 'Invalid credentials');
  }
  
  const data = await response.json();
  localStorage.setItem('authToken', data.token); // Store JWT token
  return true;
 } catch (error) {
  console.error('Login failed:', error);
  throw error;
 }
}

export function logout() {
 localStorage.removeItem('authToken');
 window.location.href = '../login.html';
}

export default { checkAuthState, login, logout };