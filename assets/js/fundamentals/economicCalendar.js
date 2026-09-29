import apiClient from '../api/apiClient.js';
import { getElement } from '../utils/helpers.js';
import { formatDate } from '../utils/formatters.js';

class EconomicCalendarPage {
 constructor() {
  this.tableBody = getElement('economic-calendar-body');
 }
 
 init() {
  // Render the UI structure immediately so it doesn't look empty
  this.renderInitialSkeleton();
  
  // Attempt to fetch real data (will safely fallback to skeletons if backend is offline)
  this.fetchEvents();
 }
 
 renderInitialSkeleton() {
  // Render 3 empty rows to show the table structure immediately
  let html = '';
  for (let i = 0; i < 3; i++) {
   html += `
        <tr>
          <td>—</td>
          <td>—</td>
          <td>—</td>
          <td><span class="news-impact low">—</span></td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
        </tr>
      `;
  }
  this.tableBody.innerHTML = html;
 }
 
 async fetchEvents() {
  try {
   // Assumes backend endpoint /api/analysis contains fundamentals, or a specific /api/calendar
   const data = await apiClient.get('/api/analysis?symbol=EURUSD');
   const events = data.fundamentals?.upcomingEvents || [];
   
   // If backend returns empty array, the skeletons remain, which is perfect.
   if (events.length === 0) {
    return;
   }
   
   // If backend returns actual data, render it
   this.tableBody.innerHTML = events.map(e => `
        <tr>
          <td>${formatDate(e.time)}</td>
          <td>${e.currency}</td>
          <td>${e.event}</td>
          <td><span class="news-impact ${e.impact.toLowerCase()}">${e.impact}</span></td>
          <td>${e.actual || '—'}</td>
          <td>${e.forecast || '—'}</td>
          <td>${e.previous || '—'}</td>
        </tr>
      `).join('');
   
  } catch (error) {
   // If fetch fails (backend offline), the skeletons remain safely.
   console.error('Failed to fetch economic calendar. Displaying static skeletons.');
  }
 }
}

const economicCalendarPage = new EconomicCalendarPage();
document.addEventListener('DOMContentLoaded', () => economicCalendarPage.init());
export default economicCalendarPage;
