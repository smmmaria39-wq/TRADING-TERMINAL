export function createSignalCard(signal) {
  // Strict safe fallbacks to prevent rendering 'undefined' or crashing
  const decision = signal.decision || 'NO_TRADE';
  const symbol = signal.symbol || '—';
  const timeframe = signal.timeframe || '—';
  
  return `
    <div class="signal-card panel ${decision.toLowerCase()}">
      <div class="signal-header">
        <span class="symbol">${symbol}</span>
        <span class="direction">${decision}</span>
      </div>
      <div class="signal-body">
        <div class="data-grid">
          <div class="data-item"><span class="label">Timeframe</span><span class="value">${timeframe}</span></div>
          <div class="data-item"><span class="label">Entry</span><span class="value">${signal.entry || '—'}</span></div>
          <div class="data-item"><span class="label">Stop Loss</span><span class="value">${signal.stopLoss || '—'}</span></div>
          <div class="data-item"><span class="label">Take Profit</span><span class="value">${signal.takeProfit || '—'}</span></div>
          <div class="data-item"><span class="label">R/R</span><span class="value">${signal.riskReward || '—'}</span></div>
          <div class="data-item"><span class="label">Confidence</span><span class="value">${signal.confidence || '—'}</span></div>
        </div>
        ${signal.reasons && signal.reasons.length ? `<div class="warnings"><strong>Reasons:</strong> ${signal.reasons.join(', ')}</div>` : ''}
        ${signal.warnings && signal.warnings.length ? `<div class="warnings">${signal.warnings.map(w => `<span class="warning-tag">${w}</span>`).join('')}</div>` : ''}
      </div>
    </div>`;
}