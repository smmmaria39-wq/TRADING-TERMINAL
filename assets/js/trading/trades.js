import { createTrade, getTrades } from '../api/tradeApi.js';
import { getElement } from '../utils/helpers.js';
import { formatPrice } from '../utils/formatters.js';
import { isPositiveNumber } from '../utils/validators.js';

class TradesPage {
 constructor() {
  this.buyBtn = getElement('trade-buy-btn');
  this.sellBtn = getElement('trade-sell-btn');
  this.historyContainer = getElement('trade-history-container');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data
  this.fetchHistory();
  
  // Setup event listeners
  if (this.buyBtn) this.buyBtn.addEventListener('click', () => this.handleOrder('BUY'));
  if (this.sellBtn) this.sellBtn.addEventListener('click', () => this.handleOrder('SELL'));
 }
 
 renderInitialSkeletons() {
  // Render 2 empty rows to show the table structure
  this.historyContainer.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Symbol</th><th>Dir</th><th>Size</th><th>Entry</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
            <tr><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
    `;
 }
 
 async fetchHistory() {
  try {
   const trades = await getTrades();
   
   // If backend returns empty array, keep skeleton
   if (!trades || trades.length === 0) {
    return;
   }
   
   // If backend returns actual data, render it
   this.historyContainer.innerHTML = `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Symbol</th><th>Dir</th><th>Size</th><th>Entry</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${trades.map(t => `
                <tr>
                  <td>${t.symbol}</td>
                  <td>${t.direction}</td>
                  <td>${t.size}</td>
                  <td>${formatPrice(t.entry)}</td>
                  <td>${t.status || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
  } catch (error) {
   // Keep skeleton if fetch fails
   console.error('Failed to fetch trade history. Displaying static skeletons.');
  }
 }
 
 async handleOrder(direction) {
  const symbol = getElement('trade-symbol').value;
  const size = getElement('trade-size').value;
  const sl = getElement('trade-sl').value;
  const tp = getElement('trade-tp').value;
  
  // Strict frontend validation
  if (!symbol || !isPositiveNumber(size) || !isPositiveNumber(sl) || !isPositiveNumber(tp)) {
   alert('Please fill all fields correctly with valid numbers.');
   return;
  }
  
  const btn = direction === 'BUY' ? this.buyBtn : this.sellBtn;
  btn.textContent = 'Submitting...';
  btn.disabled = true;
  
  try {
   // Send to backend (backend has final authority)
   await createTrade({ symbol, direction, size, stopLoss: sl, takeProfit: tp });
   alert('Order submitted successfully.');
   
   // Refresh history
   this.fetchHistory();
  } catch (error) {
   alert(`Order failed: ${error.message}`);
  } finally {
   btn.textContent = direction === 'BUY' ? 'Buy' : 'Sell';
   btn.disabled = false;
  }
 }
}

const tradesPage = new TradesPage();
document.addEventListener('DOMContentLoaded', () => tradesPage.init());
export default tradesPage;