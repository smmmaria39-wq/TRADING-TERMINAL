import { getAccounts } from '../api/accountApi.js';
import { formatCurrency } from '../utils/formatters.js';
import { showEmpty, showError } from '../utils/helpers.js';

export async function renderAccountSummary(container) {
 try {
  const data = await getAccounts();
  
  // FIX: Safely handle empty arrays or missing balance
  if (!data || Array.isArray(data) || !data.balance) {
   return showEmpty(container, 'No account data');
  }
  
  container.innerHTML = `
      <div class="data-item"><span class="label">Balance</span><span class="value">${formatCurrency(data.balance)}</span></div>
      <div class="data-item"><span class="label">Equity</span><span class="value">${formatCurrency(data.equity)}</span></div>
      <div class="data-item"><span class="label">Margin</span><span class="value">${formatCurrency(data.margin)}</span></div>
    `;
 } catch (e) { 
   showError(container); 
 }
}
