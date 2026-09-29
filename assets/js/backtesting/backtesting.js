import { runBacktest } from '../api/backtestApi.js';

class BacktestingPage {
 constructor() {
  this.resultsContainer = document.getElementById('backtest-results-container');
  this.form = document.getElementById('backtest-form');
 }
 
 init() {
  // Render initial skeleton so the UI isn't empty
  this.renderInitialSkeleton();
  
  if (this.form) {
   this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }
 }
 
 renderInitialSkeleton() {
  this.resultsContainer.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-box"><span class="label">Total Trades</span><span class="value">—</span></div>
        <div class="metric-box"><span class="label">Win Rate</span><span class="value">—</span></div>
        <div class="metric-box"><span class="label">Profit Factor</span><span class="value">—</span></div>
        <div class="metric-box"><span class="label">Max Drawdown</span><span class="value">—</span></div>
      </div>
      <div class="empty-state" style="margin-top: 16px;">Run a backtest to see results</div>
    `;
 }
 
 async handleFormSubmit(e) {
  e.preventDefault();
  
  // Set loading state
  this.resultsContainer.innerHTML = '<div class="loading-state">Running backtest...</div>';
  
  const config = {
   strategy: document.getElementById('backtest-strategy').value,
   symbol: document.getElementById('backtest-symbol').value,
   startDate: document.getElementById('backtest-start').value,
   endDate: document.getElementById('backtest-end').value
  };
  
  try {
   const result = await runBacktest(config);
   
   // Render actual results
   this.resultsContainer.innerHTML = `
        <div class="metrics-grid">
          <div class="metric-box"><span class="label">Total Trades</span><span class="value">${result.metrics.totalTrades || 0}</span></div>
          <div class="metric-box"><span class="label">Win Rate</span><span class="value">${result.metrics.winRate || 0}%</span></div>
          <div class="metric-box"><span class="label">Profit Factor</span><span class="value">${result.metrics.profitFactor || 0}</span></div>
          <div class="metric-box"><span class="label">Max Drawdown</span><span class="value">${result.metrics.maxDrawdown || 0}%</span></div>
        </div>
        <div class="panel-header" style="margin-top: 16px;"><h3>Equity Curve</h3></div>
        <div class="chart-container" style="height: 200px; background: var(--color-bg); border: 1px solid var(--color-border);">
            <div class="empty-state">Chart library required to render curve</div>
        </div>
      `;
  } catch (error) {
   // Safely fall back to skeleton if API fails
   this.renderInitialSkeleton();
   this.resultsContainer.innerHTML += `<div class="error-state">Backtest failed: ${error.message}</div>`;
  }
 }
}

const backtestingPage = new BacktestingPage();
document.addEventListener('DOMContentLoaded', () => backtestingPage.init());
export default backtestingPage;
