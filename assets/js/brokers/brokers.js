import { getBrokers } from '../api/brokerApi.js';
import { getElement } from '../utils/helpers.js';

class BrokersPage {
 constructor() {
  this.gridContainer = getElement('broker-grid-container');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look stuck
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchBrokers();
 }
 
 renderInitialSkeletons() {
  const defaultBrokers = ['MetaTrader 5', 'MetaTrader 4', 'cTrader', 'Paper Trading'];
  this.gridContainer.innerHTML = defaultBrokers.map(b => `
      <div class="broker-card">
        <div class="structure-item">
          <span class="structure-label">Broker</span>
          <span class="structure-value">${b}</span>
        </div>
        <div class="structure-item">
          <span class="structure-label">Status</span>
          <span class="structure-value">—</span>
        </div>
        <div class="structure-item">
          <span class="structure-label">Balance</span>
          <span class="structure-value">—</span>
        </div>
        <div class="structure-item">
          <span class="structure-label">Equity</span>
          <span class="structure-value">—</span>
        </div>
      </div>
    `).join('');
 }
 
 async fetchBrokers() {
  try {
   const brokers = await getBrokers();
   
   // If backend returns actual broker data, render it
   if (brokers && brokers.length > 0) {
    this.gridContainer.innerHTML = brokers.map(b => `
          <div class="broker-card">
            <div class="structure-item">
              <span class="structure-label">Broker</span>
              <span class="structure-value active">${b.name || '—'}</span>
            </div>
            <div class="structure-item">
              <span class="structure-label">Status</span>
              <span class="structure-value ${b.status === 'CONNECTED' ? 'active' : ''}">${b.status || '—'}</span>
            </div>
            <div class="structure-item">
              <span class="structure-label">Balance</span>
              <span class="structure-value">${b.balance || '—'}</span>
            </div>
            <div class="structure-item">
              <span class="structure-label">Equity</span>
              <span class="structure-value">${b.equity || '—'}</span>
            </div>
          </div>
        `).join('');
   }
   // If backend returns empty array, the skeletons remain, which is perfect.
  } catch (error) {
   // If fetch fails (backend offline), the skeletons remain safely.
   console.error('Failed to fetch brokers. Displaying static skeletons.');
  }
 }
}

const brokersPage = new BrokersPage();
document.addEventListener('DOMContentLoaded', () => brokersPage.init());
export default brokersPage;
