import { getMarketData } from '../api/marketApi.js';
import { formatPrice } from '../utils/formatters.js';
import { showEmpty, showError } from '../utils/helpers.js';

export async function renderMarketOverview(container, symbol) {
 if (!symbol) return showEmpty(container, 'Select a symbol');
 try {
  const data = await getMarketData(symbol);
  container.innerHTML = `
      <div class="data-item"><span class="label">Bid</span><span class="value">${formatPrice(data.bid)}</span></div>
      <div class="data-item"><span class="label">Ask</span><span class="value">${formatPrice(data.ask)}</span></div>
      <div class="data-item"><span class="label">Spread</span><span class="value">${formatPrice(data.spread)}</span></div>
    `;
 } catch (e) { showError(container); }
}