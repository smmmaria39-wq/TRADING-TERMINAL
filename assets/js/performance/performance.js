import apiClient from '../api/apiClient.js';
import { getElement } from '../utils/helpers.js';

class PerformancePage {
 constructor() {
  this.summaryContainer = getElement('performance-summary');
  this.chartContainer = getElement('equity-chart-container');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeletons();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchPerformance();
 }
 
 renderInitialSkeletons() {
  // Render Metrics Skeleton
  this.summaryContainer.innerHTML = `
      <div class="metric-box"><span class="label">Net Profit</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Win Rate</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Profit Factor</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Max DD</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Total Trades</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Avg Win</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Avg Loss</span><span class="value">—</span></div>
      <div class="metric-box"><span class="label">Expectancy</span><span class="value">—</span></div>
    `;
  
  // Render Chart Skeleton
  this.chartContainer.innerHTML = '<div class="empty-state">No performance data available</div>';
 }
 
 async fetchPerformance() {
  try {
   const data = await apiClient.get('/api/performance');
   
   // If backend returns actual data, render it
   this.summaryContainer.innerHTML = `
        <div class="metric-box"><span class="label">Net Profit</span><span class="value">${data.netProfit || '—'}</span></div>
        <div class="metric-box"><span class="label">Win Rate</span><span class="value">${data.winRate || '—'}%</span></div>
        <div class="metric-box"><span class="label">Profit Factor</span><span class="value">${data.profitFactor || '—'}</span></div>
        <div class="metric-box"><span class="label">Max DD</span><span class="value">${data.maxDrawdown || '—'}%</span></div>
        <div class="metric-box"><span class="label">Total Trades</span><span class="value">${data.totalTrades || '—'}</span></div>
        <div class="metric-box"><span class="label">Avg Win</span><span class="value">${data.averageWin || '—'}</span></div>
        <div class="metric-box"><span class="label">Avg Loss</span><span class="value">${data.averageLoss || '—'}</span></div>
        <div class="metric-box"><span class="label">Expectancy</span><span class="value">${data.expectancy || '—'}</span></div>
      `;
   
   this.chartContainer.innerHTML = '<div class="empty-state">Chart library required to render equity curve</div>';
  } catch (error) {
   // If fetch fails (backend offline), the skeletons remain safely.
   console.error('Failed to fetch performance data. Displaying static skeletons.');
  }
 }
}

const performancePage = new PerformancePage();
document.addEventListener('DOMContentLoaded', () => performancePage.init());
export default performancePage;
