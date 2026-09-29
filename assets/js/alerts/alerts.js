import apiClient from '../api/apiClient.js';
import { getElement, showLoading, showEmpty, showError } from '../utils/helpers.js';
import { formatDate } from '../utils/formatters.js';

class AlertsPage {
 init() {
  this.listContainer = getElement('alerts-list-container');
  this.fetchAlerts();
 }
 
 async fetchAlerts() {
  showLoading(this.listContainer);
  try {
   const alerts = await apiClient.get('/api/alerts');
   if (!alerts || alerts.length === 0) return showEmpty(this.listContainer, 'No alerts found');
   
   this.listContainer.innerHTML = alerts.map(a => `
        <div class="news-event-row">
          <div>
            <strong>${a.title}</strong>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">${a.message}</div>
          </div>
          <span class="news-impact ${a.severity.toLowerCase()}">${a.severity}</span>
        </div>
      `).join('');
  } catch (e) { showError(this.listContainer); }
 }
}

export default new AlertsPage();
