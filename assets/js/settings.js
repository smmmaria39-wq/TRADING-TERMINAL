import apiClient from './api/apiClient.js';
import { getElement } from './utils/helpers.js';

class SettingsPage {
 constructor() {
  this.navItems = document.querySelectorAll('.settings-nav li');
  this.panelTitle = getElement('settings-panel-title');
  this.panelBody = getElement('settings-panel-body');
 }
 
 init() {
  this.setupNavigation();
  this.fetchSettings();
 }
 
 setupNavigation() {
  this.navItems.forEach(item => {
   item.addEventListener('click', () => {
    // Remove active from all
    this.navItems.forEach(nav => nav.classList.remove('active'));
    // Add active to clicked
    item.classList.add('active');
    
    // Update panel content based on tab
    const tabName = item.getAttribute('data-tab');
    this.renderTabContent(tabName);
   });
  });
 }
 
 renderTabContent(tabName) {
  // Render different forms based on the selected tab
  switch (tabName) {
   case 'account':
    this.panelTitle.textContent = 'Account Settings';
    this.panelBody.innerHTML = `
          <div class="order-group"><label>Name</label><input type="text" class="form-control" placeholder="—"></div>
          <div class="order-group"><label>Email</label><input type="email" class="form-control" placeholder="—"></div>
          <button class="btn btn-primary">Save Changes</button>
        `;
    break;
   case 'trading':
    this.panelTitle.textContent = 'Trading Settings';
    this.panelBody.innerHTML = `
          <div class="order-group"><label>Default Risk %</label><input type="number" class="form-control" placeholder="1"></div>
          <div class="order-group"><label>Default Timeframe</label>
            <select class="form-control"><option>M15</option><option>H1</option></select>
          </div>
          <button class="btn btn-primary">Save Changes</button>
        `;
    break;
   default:
    this.panelTitle.textContent = `${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings`;
    this.panelBody.innerHTML = `<div class="empty-state">No settings available for this section</div>`;
  }
 }
 
 async fetchSettings() {
  try {
   // Attempt to fetch real user settings from backend
   const data = await apiClient.get('/api/settings');
   
   if (data) {
    // Populate form fields safely
    const nameInput = this.panelBody.querySelector('input[type="text"]');
    const emailInput = this.panelBody.querySelector('input[type="email"]');
    
    if (nameInput) nameInput.value = data.name || '';
    if (emailInput) emailInput.value = data.email || '';
   }
  } catch (error) {
   // Keep placeholders ("—") if backend is offline
   console.error('Failed to fetch settings. Displaying empty form.');
  }
 }
}

const settingsPage = new SettingsPage();
document.addEventListener('DOMContentLoaded', () => settingsPage.init());
export default settingsPage;