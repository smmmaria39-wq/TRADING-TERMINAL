import { getSignals } from '../api/signalApi.js';
import { showEmpty, showError } from '../utils/helpers.js';

export async function renderActiveSignal(container) {
 try {
  const data = await getSignals();
  if (!data || data.length === 0) return showEmpty(container, 'No active signals');
  
  const sig = data[0];
  container.innerHTML = `
      <div class="signal-card ${sig.decision.toLowerCase()}">
        <div class="signal-header"><span class="symbol">${sig.symbol}</span><span class="direction">${sig.decision}</span></div>
        <div class="data-grid">
          <div class="data-item"><span class="label">Entry</span><span class="value">${sig.entry || '—'}</span></div>
          <div class="data-item"><span class="label">SL</span><span class="value">${sig.stopLoss || '—'}</span></div>
          <div class="data-item"><span class="label">TP</span><span class="value">${sig.takeProfit || '—'}</span></div>
        </div>
      </div>`;
 } catch (e) { showError(container); }
}