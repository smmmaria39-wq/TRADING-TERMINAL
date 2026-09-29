import CONFIG from './config.js';
import { checkAuthState } from './auth.js';

/**
 * Notifications Manager
 * Handles the notification dropdown panel and fetches alerts.
 */
class NotificationsManager {
 constructor() {
  this.panel = null;
  this.bell = null;
  this.list = null;
 }
 
 init() {
  this.bell = document.getElementById('notification-toggle');
  this.panel = document.getElementById('notification-dropdown');
  
  if (this.bell && this.panel) {
   this.bell.addEventListener('click', (e) => {
    e.stopPropagation();
    this.panel.classList.toggle('hidden');
    if (!this.panel.classList.contains('hidden')) {
     this.fetchNotifications();
    }
   });
   
   // Close panel when clicking outside
   document.addEventListener('click', (e) => {
    if (!this.panel.contains(e.target) && !this.bell.contains(e.target)) {
     this.panel.classList.add('hidden');
    }
   });
  }
 }
 
 async fetchNotifications() {
  if (!this.list) this.list = document.getElementById('notifications-list');
  if (!this.list) return;
  
  this.list.innerHTML = '<div class="loading-state">Loading notifications...</div>';
  
  try {
   const isAuth = await checkAuthState();
   if (!isAuth) return;
   
   // TODO: Replace with actual API call via apiClient
   // const response = await apiClient.get('/api/alerts');
   // const alerts = response.data;
   
   // Strict empty state since we have no backend data yet
   this.list.innerHTML = '<div class="empty-state">No new notifications</div>';
  } catch (error) {
   this.list.innerHTML = '<div class="error-state">Unable to load notifications</div>';
  }
 }
}

export const notificationsManager = new NotificationsManager();
export default notificationsManager;