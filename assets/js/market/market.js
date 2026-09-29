import { getMarketData } from '../api/marketApi.js';
import { getElement } from '../utils/helpers.js';
import { formatPrice } from '../utils/formatters.js';

class WatchlistPage {
 constructor() {
  this.container = getElement('watchlist-grid');
  // Default symbols to show in the skeleton immediately
  this.symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'XAUUSD', 'USDCAD'];
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchWatchlist();
 }
 
 renderInitialSkeletons() {
  // Render empty market cards to show the UI structure immediately
  this.container.innerHTML = this.symbols.map(sym => `
      <div class="market-card panel">
        <div class="market-card-header">
          <span class="symbol">${sym}</span>
          <span class="status-dot disconnected"></span>
        </div>
        <div class="market-card-body">
          <div class="price">—</div>
          <div class="change">—</div>
        </div>
      </div>
    `).join('');
 }
 
 async fetchWatchlist() {
  try {
   // Fetch data for each symbol in the background
   // In a production system, you would use a single batched API call or WebSocket stream here
   // to avoid spamming the REST API.
   
   for (let i = 0; i < this.symbols.length; i++) {
    const sym = this.symbols[i];
    try {
     const data = await getMarketData(sym);
     
     // Update the specific card with real data safely
     const cards = this.container.querySelectorAll('.market-card');
     if (cards[i]) {
      cards[i].innerHTML = `
              <div class="market-card-header">
                <span class="symbol">${sym}</span>
                <span class="status-dot connected"></span>
              </div>
              <div class="market-card-body">
                <div class="price">${formatPrice(data.bid)}</div>
                <div class="change">${data.change || '—'}</div>
              </div>
            `;
     }
    } catch (e) {
     // If a single symbol fails, leave the skeleton for that card
     console.error(`Failed to fetch data for ${sym}. Keeping skeleton.`);
    }
   }
  } catch (error) {
   // Global error handler
   console.error('Failed to fetch watchlist data. Displaying static skeletons.');
  }
 }
}

const watchlistPage = new WatchlistPage();
document.addEventListener('DOMContentLoaded', () => watchlistPage.init());
export default watchlistPage;
