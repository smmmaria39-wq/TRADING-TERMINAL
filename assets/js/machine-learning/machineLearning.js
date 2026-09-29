import { getMlStatus, getMlPredictions } from '../api/mlApi.js';
import { getElement } from '../utils/helpers.js';

class MachineLearningPage {
 constructor() {
  this.statusContainer = getElement('ml-status-container');
  this.predictionsContainer = getElement('ml-predictions-container');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchData();
 }
 
 renderInitialSkeletons() {
  // Render Model Status Skeleton
  this.statusContainer.innerHTML = `
      <div class="structure-grid">
        <div class="structure-item"><span class="structure-label">Status</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">Version</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">Last Trained</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">Drift</span><span class="structure-value">—</span></div>
      </div>
    `;
  
  // Render Predictions Skeleton
  this.predictionsContainer.innerHTML = `
      <div class="data-grid">
        <div class="data-item"><span class="label">Direction</span><span class="value">—</span></div>
        <div class="data-item"><span class="label">Buy Prob.</span><span class="value">—</span></div>
        <div class="data-item"><span class="label">Sell Prob.</span><span class="value">—</span></div>
        <div class="data-item"><span class="label">Volatility</span><span class="value">—</span></div>
        <div class="data-item"><span class="label">Regime</span><span class="value">—</span></div>
        <div class="data-item"><span class="label">Entry Quality</span><span class="value">—</span></div>
      </div>
    `;
 }
 
 async fetchData() {
  try {
   const status = await getMlStatus();
   if (status) {
    this.statusContainer.innerHTML = `
          <div class="structure-grid">
            <div class="structure-item"><span class="structure-label">Status</span><span class="structure-value active">${status.status || '—'}</span></div>
            <div class="structure-item"><span class="structure-label">Version</span><span class="structure-value">${status.modelVersion || '—'}</span></div>
            <div class="structure-item"><span class="structure-label">Last Trained</span><span class="structure-value">${status.lastTrained || '—'}</span></div>
            <div class="structure-item"><span class="structure-label">Drift</span><span class="structure-value ${status.drift ? 'detected' : ''}">${status.drift ? 'Detected' : 'None'}</span></div>
          </div>
        `;
   }
  } catch (e) {
   // Keep skeleton if fetch fails
   console.error('Failed to fetch ML status. Displaying static skeletons.');
  }
  
  try {
   const preds = await getMlPredictions('EURUSD'); // Example symbol
   if (preds) {
    this.predictionsContainer.innerHTML = `
          <div class="data-grid">
            <div class="data-item"><span class="label">Direction</span><span class="value">${preds.direction || '—'}</span></div>
            <div class="data-item"><span class="label">Buy Prob.</span><span class="value">${preds.buyProbability || '—'}</span></div>
            <div class="data-item"><span class="label">Sell Prob.</span><span class="value">${preds.sellProbability || '—'}</span></div>
            <div class="data-item"><span class="label">Volatility</span><span class="value">${preds.volatility || '—'}</span></div>
            <div class="data-item"><span class="label">Regime</span><span class="value">${preds.regime || '—'}</span></div>
            <div class="data-item"><span class="label">Entry Quality</span><span class="value">${preds.entryQuality || '—'}</span></div>
          </div>
        `;
   }
  } catch (e) {
   // Keep skeleton if fetch fails
   console.error('Failed to fetch ML predictions. Displaying static skeletons.');
  }
 }
}

const machineLearningPage = new MachineLearningPage();
document.addEventListener('DOMContentLoaded', () => machineLearningPage.init());
export default machineLearningPage;
