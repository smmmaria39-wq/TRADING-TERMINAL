import { renderMarketOverview } from './marketOverview.js';
import { renderAccountSummary } from './accountSummary.js';
import { renderActiveSignal } from './activeSignals.js';
import { getElement } from '../utils/helpers.js';

class DashboardPage {
 constructor() {
  this.chart = null;
  this.candleSeries = null;
 }
 
 init() {
  const marketOverviewEl = getElement('market-overview-data');
  const accountSummaryEl = getElement('account-summary-data');
  const activeSignalEl = getElement('active-signal-container');
  const chartContainer = getElement('main-chart-container');
  const timeframeSelector = getElement('chart-timeframe');
  const symbolSelector = getElement('dashboard-symbol-selector');
  
  // 1. Fetch initial data
  renderAccountSummary(accountSummaryEl);
  renderActiveSignal(activeSignalEl);
  
  // 2. Initialize the TradingView Lightweight Chart
  if (chartContainer) {
   if (!window.LightweightCharts) {
    console.error('[Dashboard] TradingView library not found! Ensure the script is in your HTML <head>.');
    return;
   }
   
   // STRICT FIX: Clear the placeholder text before initializing the chart
   chartContainer.innerHTML = '';
   
   this.chart = window.LightweightCharts.createChart(chartContainer, {
    layout: {
     background: { color: '#0d1117' },
     textColor: '#8b949e'
    },
    grid: {
     vertLines: { color: '#161b22' },
     horzLines: { color: '#161b22' }
    },
    timeScale: { borderColor: '#30363d' },
    rightPriceScale: { borderColor: '#30363d' },
    crosshair: {
     mode: 0,
     vertLineColor: '#58a6ff',
     horzLineColor: '#58a6ff'
    }
   });
   
   // Use the v4+ addSeries method
   this.candleSeries = this.chart.addSeries(
    window.LightweightCharts.CandlestickSeries,
    {
     upColor: '#3fb950',
     downColor: '#f85149',
     borderVisible: false,
     wickUpColor: '#3fb950',
     wickDownColor: '#f85149'
    }
   );
   
   // Strict responsive sizing logic to prevent overflow
   const resizeObserver = new ResizeObserver(entries => {
    if (entries.length === 0) return;
    const target = entries[0].target;
    if (target.clientWidth > 0 && target.clientHeight > 0) {
     this.chart.applyOptions({
      width: target.clientWidth,
      height: target.clientHeight
     });
    }
   });
   resizeObserver.observe(chartContainer);
   
   // Force an initial resize call to fit container immediately on load
   setTimeout(() => {
    if (chartContainer.clientWidth > 0 && chartContainer.clientHeight > 0) {
     this.chart.applyOptions({
      width: chartContainer.clientWidth,
      height: chartContainer.clientHeight
     });
    }
   }, 100);
  }
  
  // 3. Setup Symbol Selector
  if (symbolSelector) {
   if (symbolSelector.options.length <= 1) {
    ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'].forEach(sym => {
     const option = document.createElement('option');
     option.value = sym;
     option.textContent = sym;
     symbolSelector.appendChild(option);
    });
   }
   
   symbolSelector.addEventListener('change', (e) => {
    renderMarketOverview(marketOverviewEl, e.target.value);
    this.fetchChartData(e.target.value, timeframeSelector?.value || 'M15');
   });
  }
  
  // 4. Setup Timeframe Selector
  if (timeframeSelector) {
   timeframeSelector.addEventListener('change', (e) => {
    const symbol = symbolSelector?.value || 'EURUSD';
    this.fetchChartData(symbol, e.target.value);
   });
  }
 }
 
 async fetchChartData(symbol, timeframe) {
  if (!this.candleSeries) return;
  
  // Clear the chart while waiting for data
  this.candleSeries.setData([]);
  
  try {
   console.log(`[Chart] Waiting for backend data for ${symbol} ${timeframe}...`);
  } catch (error) {
   console.error('Failed to fetch chart data:', error);
  }
 }
}

export default new DashboardPage();