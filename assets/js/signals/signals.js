import { getSignals } from '../api/signalApi.js';
import { createSignalCard } from './signalCard.js';
import { getElement } from '../utils/helpers.js';

class SignalsPage {
 constructor() {
  this.container = getElement('signals-list-container');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchSignals();
 }
 
 renderInitialSkeletons() {
  // Render 2 empty signal cards to show the UI structure immediately
  let html = '';
  for (let i = 0; i < 2; i++) {
   html += `
        <div class="signal-card panel">
          <div class="signal-header">
            <span class="symbol">—</span>
            <span class="direction">—</span>
          </div>
          <div class="signal-body">
            <div class="data-grid">
              <div class="data-item"><span class="label">Timeframe</span><span class="value">—</span></div>
              <div class="data-item"><span class="label">Entry</span><span class="value">—</span></div>
              <div class="data-item"><span class="label">Stop Loss</span><span class="value">—</span></div>
              <div class="data-item"><span class="label">Take Profit</span><span class="value">—</span></div>
              <div class="data-item"><span class="label">R/R</span><span class="value">—</span></div>
              <div class="data-item"><span class="label">Confidence</span><span class="value">—</span></div>
            </div>
          </div>
        </div>
      `;
  }
  this.container.innerHTML = html;
 }
 
 async fetchSignals() {
  try {
   const signals = await getSignals();
   
   // If backend returns empty array, keep skeleton
   if (!signals || signals.length === 0) {
    return;
   }
   
   // If backend returns actual data, render it
   this.container.innerHTML = signals.map(createSignalCard).join('');
  } catch (error) {
   // If fetch fails (backend offline), the skeletons remain safely.
   console.error('Failed to fetch signals. Displaying static skeletons.');
  }
 }
}

const signalsPage = new SignalsPage();
document.addEventListener('DOMContentLoaded', () => signalsPage.init());
export default signalsPage;
