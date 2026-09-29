import { getMarketAnalysis } from '../api/analysisApi.js';

class AnalysisPage {
 constructor() {
  this.symbolSelector = document.getElementById('analysis-symbol-selector');
  this.containers = {
   technical: document.getElementById('technical-analysis-container'),
   priceAction: document.getElementById('price-action-container'),
   structure: document.getElementById('market-structure-container'),
   mtf: document.getElementById('mtf-container'),
   regime: document.getElementById('regime-container'),
   fundamentals: document.getElementById('fundamentals-container'),
   sentiment: document.getElementById('sentiment-container')
  };
 }
 
 init() {
  // Add default symbols if the backend hasn't provided them yet
  if (this.symbolSelector) {
   const defaultSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];
   defaultSymbols.forEach(sym => {
    const option = document.createElement('option');
    option.value = sym;
    option.textContent = sym;
    this.symbolSelector.appendChild(option);
   });
   
   this.symbolSelector.addEventListener('change', (e) => this.fetchData(e.target.value));
  }
  
  // Render initial strict UI skeletons
  this.renderInitialSkeletons();
 }
 
 renderInitialSkeletons() {
  // Render Technical Table Skeleton
  this.containers.technical.innerHTML = `
      <table class="analysis-table">
        <thead><tr><th>Indicator</th><th style="text-align:right;">Value</th></tr></thead>
        <tbody>
          <tr><td class="indicator-name">RSI (14)</td><td class="indicator-value neutral">—</td></tr>
          <tr><td class="indicator-name">MACD</td><td class="indicator-value neutral">—</td></tr>
          <tr><td class="indicator-name">EMA (20)</td><td class="indicator-value neutral">—</td></tr>
          <tr><td class="indicator-name">EMA (50)</td><td class="indicator-value neutral">—</td></tr>
          <tr><td class="indicator-name">ATR (14)</td><td class="indicator-value neutral">—</td></tr>
        </tbody>
      </table>
    `;
  
  // Render Structure Skeleton
  this.containers.structure.innerHTML = `
      <div class="structure-grid">
        <div class="structure-item"><span class="structure-label">Trend</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">BOS</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">CHOCH</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">OBs</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">FVGs</span><span class="structure-value">—</span></div>
      </div>
    `;
  
  // Render MTF Matrix Skeleton
  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];
  this.containers.mtf.innerHTML = `
      <div class="mtf-matrix">
        ${timeframes.map(tf => `
          <div class="mtf-cell">
            <span class="tf-label">${tf}</span>
            <span class="tf-direction neutral">—</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 8px; font-size: 0.8rem; color: var(--color-text-muted);">
        Alignment Score: —
      </div>
    `;
  
  // Render Regime Skeleton
  this.containers.regime.innerHTML = `
      <div class="structure-grid">
        <div class="structure-item"><span class="structure-label">Regime</span><span class="structure-value">—</span></div>
        <div class="structure-item"><span class="structure-label">Strength</span><span class="structure-value">—</span></div>
      </div>
    `;
  
  this.containers.priceAction.innerHTML = '<div class="empty-state">No patterns detected</div>';
  this.containers.fundamentals.innerHTML = '<div class="empty-state">No upcoming events</div>';
  
  this.containers.sentiment.innerHTML = `
      <div class="sentiment-label"><span>Bullish (0)</span><span>Bearish (0)</span></div>
      <div class="sentiment-bar-container">
        <div class="sentiment-bullish" style="width: 0%"></div>
        <div class="sentiment-bearish" style="width: 0%"></div>
      </div>
      <div style="margin-top: 8px; font-size: 0.85rem; color: var(--color-text-muted);">Score: —</div>
    `;
 }
 
 async fetchData(symbol) {
  if (!symbol) return;
  
  // Set loading states
  Object.values(this.containers).forEach(c => {
   c.innerHTML = '<div class="loading-state">Loading data...</div>';
  });
  
  try {
   const analysis = await getMarketAnalysis(symbol);
   this.renderTechnical(analysis.indicators);
   this.renderPriceAction(analysis.priceAction);
   this.renderStructure(analysis.structure);
   this.renderMTF(analysis.multiTimeframe);
   this.renderRegime(analysis.regime);
   this.renderFundamentals(analysis.fundamentals);
   this.renderSentiment(analysis.sentiment);
  } catch (error) {
   // If fetch fails, render the skeletons back so the UI doesn't break
   this.renderInitialSkeletons();
  }
 }
 
 renderTechnical(indicators) {
  if (!indicators) return this.renderInitialSkeletons();
  
  const rows = [
   { name: 'RSI (14)', value: indicators.momentum?.rsi14 },
   { name: 'MACD', value: indicators.momentum?.macd?.histogram },
   { name: 'EMA (20)', value: indicators.trend?.ema20 },
   { name: 'EMA (50)', value: indicators.trend?.ema50 },
   { name: 'ATR (14)', value: indicators.volatility?.atr14 },
   { name: 'Bollinger Upper', value: indicators.volatility?.bollingerBands?.upper },
   { name: 'Bollinger Lower', value: indicators.volatility?.bollingerBands?.lower }
  ];
  
  this.containers.technical.innerHTML = `
      <table class="analysis-table">
        <thead><tr><th>Indicator</th><th style="text-align:right;">Value</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr><td class="indicator-name">${r.name}</td><td class="indicator-value neutral">${r.value !== null && r.value !== undefined ? r.value : '—'}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
 }
 
 renderStructure(struct) {
  if (!struct) return this.renderInitialSkeletons();
  this.containers.structure.innerHTML = `
      <div class="structure-grid">
        <div class="structure-item"><span class="structure-label">Trend</span><span class="structure-value active">${struct.trend || '—'}</span></div>
        <div class="structure-item"><span class="structure-label">BOS</span><span class="structure-value ${struct.breakOfStructure ? 'detected' : ''}">${struct.breakOfStructure ? 'Yes' : 'No'}</span></div>
        <div class="structure-item"><span class="structure-label">CHOCH</span><span class="structure-value ${struct.changeOfCharacter ? 'detected' : ''}">${struct.changeOfCharacter ? 'Yes' : 'No'}</span></div>
        <div class="structure-item"><span class="structure-label">OBs</span><span class="structure-value">${struct.orderBlocks?.bullish.length + struct.orderBlocks?.bearish.length || 0}</span></div>
        <div class="structure-item"><span class="structure-label">FVGs</span><span class="structure-value">${struct.fairValueGaps?.length || 0}</span></div>
      </div>
    `;
 }
 
 renderMTF(mtf) {
  if (!mtf) return this.renderInitialSkeletons();
  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];
  this.containers.mtf.innerHTML = `
      <div class="mtf-matrix">
        ${timeframes.map(tf => `
          <div class="mtf-cell">
            <span class="tf-label">${tf}</span>
            <span class="tf-direction neutral">—</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 8px; font-size: 0.8rem; color: var(--color-text-muted);">
        Alignment Score: ${mtf.alignmentScore || '0.00'}
      </div>
    `;
 }
 
 renderRegime(regime) {
  if (!regime) return this.renderInitialSkeletons();
  this.containers.regime.innerHTML = `
      <div class="structure-grid">
        <div class="structure-item"><span class="structure-label">Regime</span><span class="structure-value active">${regime.regime || '—'}</span></div>
        <div class="structure-item"><span class="structure-label">Strength</span><span class="structure-value">${regime.strength || '0.00'}</span></div>
      </div>
    `;
 }
 
 renderPriceAction(pa) {
  if (!pa || (!pa.candlestickPatterns?.length && !pa.breakout)) {
   return this.containers.priceAction.innerHTML = '<div class="empty-state">No patterns detected</div>';
  }
  const tags = [];
  if (pa.breakout) tags.push(`<span class="analysis-tag ${pa.breakout.type.includes('BULLISH') ? 'bullish' : 'bearish'}">${pa.breakout.type}</span>`);
  if (pa.rejection) tags.push(`<span class="analysis-tag ${pa.rejection.type.includes('BULLISH') ? 'bullish' : 'bearish'}">${pa.rejection.type}</span>`);
  pa.candlestickPatterns?.forEach(p => tags.push(`<span class="analysis-tag">${p.type}</span>`));
  this.containers.priceAction.innerHTML = `<div class="analysis-tags-container">${tags.join('')}</div>`;
 }
 
 renderFundamentals(fund) {
  if (!fund || fund.status === 'PENDING' || !fund.upcomingEvents || fund.upcomingEvents.length === 0) {
   return this.containers.fundamentals.innerHTML = '<div class="empty-state">No upcoming events</div>';
  }
  this.containers.fundamentals.innerHTML = `
      <div class="news-event-row">
        <span>${fund.highImpactWarning || 'No high impact events'}</span>
        <span class="news-impact high">Warning</span>
      </div>
    `;
 }
 
 renderSentiment(sent) {
  if (!sent) return this.renderInitialSkeletons();
  const bull = sent.bullish || 0;
  const bear = sent.bearish || 0;
  const total = bull + bear;
  this.containers.sentiment.innerHTML = `
      <div class="sentiment-label"><span>Bullish (${bull})</span><span>Bearish (${bear})</span></div>
      <div class="sentiment-bar-container">
        <div class="sentiment-bullish" style="width: ${total > 0 ? (bull/total)*100 : 0}%"></div>
        <div class="sentiment-bearish" style="width: ${total > 0 ? (bear/total)*100 : 0}%"></div>
      </div>
      <div style="margin-top: 8px; font-size: 0.85rem; color: var(--color-text-muted);">Score: ${sent.score || '—'}</div>
    `;
 }
}

const analysisPage = new AnalysisPage();
document.addEventListener('DOMContentLoaded', () => analysisPage.init());
export default analysisPage;
