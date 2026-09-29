import CONFIG from '../config.js';

/**
 * Centralized WebSocket Client
 * Handles connection, authentication, exponential backoff reconnection, and heartbeat.
 */
class WebSocketClient {
 constructor() {
  this.socket = null;
  this.subscriptions = new Map();
  this.isConnected = false;
  this.reconnectAttempts = 0;
  this.maxReconnectAttempts = 10;
  this.heartbeatInterval = null;
 }
 
 connect() {
  const token = localStorage.getItem('authToken');
  if (!token) {
   console.warn('[WS] No auth token found. WebSocket connection aborted.');
   this.updateStatus('disconnected');
   return;
  }
  
  const wsUrl = `${CONFIG.WEBSOCKET_URL}?token=${encodeURIComponent(token)}`;
  this.updateStatus('reconnecting');
  
  try {
   this.socket = new WebSocket(wsUrl);
   
   this.socket.onopen = () => {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.updateStatus('connected');
    this.startHeartbeat();
    console.log('[WS] Connected');
   };
   
   this.socket.onmessage = (event) => {
    try {
     const message = JSON.parse(event.data);
     this.handleMessage(message);
    } catch (e) {
     console.error('[WS] Failed to parse message:', e);
    }
   };
   
   this.socket.onerror = (error) => {
    console.error('[WS] Error:', error);
   };
   
   this.socket.onclose = () => {
    this.isConnected = false;
    this.stopHeartbeat();
    this.updateStatus('disconnected');
    this.attemptReconnect();
   };
  } catch (error) {
   console.error('[WS] Connection failed:', error);
   this.attemptReconnect();
  }
 }
 
 handleMessage(message) {
  // Handle heartbeat response
  if (message.type === 'PONG') return;
  
  // Dispatch to subscribers based on channel/type
  const channel = message.channel || message.type;
  if (channel && this.subscriptions.has(channel)) {
   const callbacks = this.subscriptions.get(channel);
   callbacks.forEach(cb => cb(message.data || message));
  }
 }
 
 subscribe(channel, callback) {
  if (!this.subscriptions.has(channel)) {
   this.subscriptions.set(channel, new Set());
  }
  this.subscriptions.get(channel).add(callback);
  
  // Send subscription message to backend
  if (this.isConnected) {
   this.send({ action: 'SUBSCRIBE', channel });
  }
 }
 
 unsubscribe(channel, callback) {
  if (this.subscriptions.has(channel)) {
   this.subscriptions.get(channel).delete(callback);
  }
 }
 
 send(data) {
  if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
   this.socket.send(JSON.stringify(data));
  }
 }
 
 startHeartbeat() {
  this.heartbeatInterval = setInterval(() => {
   this.send({ action: 'PING' });
  }, 30000); // 30 second heartbeat
 }
 
 stopHeartbeat() {
  if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
 }
 
 attemptReconnect() {
  if (this.reconnectAttempts >= this.maxReconnectAttempts) {
   console.error('[WS] Max reconnection attempts reached.');
   this.updateStatus('disconnected');
   return;
  }
  
  this.reconnectAttempts++;
  const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff (max 30s)
  console.log(`[WS] Reconnecting in ${delay/1000} seconds...`);
  
  setTimeout(() => this.connect(), delay);
 }
 
 updateStatus(status) {
  const statusDot = document.querySelector('#global-connection-status .status-dot');
  const statusText = document.querySelector('#global-connection-status .status-text');
  
  if (statusDot && statusText) {
   statusDot.className = `status-dot ${status}`;
   
   switch (status) {
    case 'connected':
     statusText.textContent = 'Connected';
     break;
    case 'reconnecting':
     statusText.textContent = 'Reconnecting...';
     break;
    default:
     statusText.textContent = 'Disconnected';
   }
  }
 }
}

export const websocketClient = new WebSocketClient();
export default websocketClient;