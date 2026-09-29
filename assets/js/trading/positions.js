import { getTrades } from '../api/tradeApi.js';
import { getElement } from '../utils/helpers.js';
import { formatPrice } from '../utils/formatters.js';

class PositionsPage {
 constructor() {
  this.tableBody = getElement('positions-table-body');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchPositions();
 }
 
 renderInitialSkeletons() {
  // Render 3 empty rows to show the table structure immediately
  let html = '';
  for (let i = 0; i < 3; i++) {
   html += `
        <tr class="position-row">
          <td class="symbol">—</td>
          <td class="direction">—</td>
          <td class="size">—</td>
          <td class="entry">—</td>
          <td class="current">—</td>
          <td class="pnl">—</td>
          <td class="actions"><button class="btn btn-secondary btn-sm" disabled>—</button></td>
        </tr>
      `;
  }
  this.tableBody.innerHTML = html;
 }
 
 async fetchPositions() {
  try {
   const trades = await getTrades();
   
   // If backend returns empty array, keep skeleton
   if (!trades || trades.length === 0) {
    return;
   }
   
   // If backend returns actual data, render it with strict safe fallbacks
   this.tableBody.innerHTML = trades.map(t => `
        <tr class="position-row">
          <td class="symbol">${t.symbol || '—'}</td>
          <td class="direction">${t.direction || '—'}</td>
          <td class="size">${t.size || '—'}</td>
          <td class="entry">${formatPrice(t.entry)}</td>
          <td class="current">${formatPrice(t.current)}</td>
          <td class="pnl">${t.pnl !== null && t.pnl !== undefined ? t.pnl : '—'}</td>
          <td class="actions"><button class="btn btn-danger btn-sm">Close</button></td>
        </tr>
      `).join('');
   
  } catch (error) {
   // If fetch fails (backend offline), the skeletons remain safely.
   console.error('Failed to fetch positions. Displaying static skeletons.');
  }
 }
}

const positionsPage = new PositionsPage();
document.addEventListener('DOMContentLoaded', () => positionsPage.init());
export default positionsPage;