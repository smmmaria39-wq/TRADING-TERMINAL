import { checkAuthState } from './auth.js';
import { initNavigation } from './navigation.js';
import themeManager from './theme.js';
import notificationsManager from './notifications.js';
import websocketClient from './websocket/websocketClient.js';
import marketSocket from './websocket/marketSocket.js';
import signalSocket from './websocket/signalSocket.js';
import tradeSocket from './websocket/tradeSocket.js';

/**
 * Main Application Entry Point
 */
async function initApp() {
 const isAuthPage = window.location.pathname.includes('login.html') ||
  window.location.pathname.includes('index.html');
 
 if (!isAuthPage) {
  // 1. Check Auth
  const isAuthenticated = await checkAuthState();
  if (!isAuthenticated) return;
  
  // 2. Init Navigation Shell
  await initNavigation();
  
  // 3. Init UI Modules
  themeManager.init();
  notificationsManager.init();
  
  // 4. Init WebSockets & Subscriptions
  websocketClient.connect();
  marketSocket.init();
  signalSocket.init();
  tradeSocket.init();
  
  console.log('[App] Application shell and WebSockets initialized.');
 }
}

document.addEventListener('DOMContentLoaded', initApp);