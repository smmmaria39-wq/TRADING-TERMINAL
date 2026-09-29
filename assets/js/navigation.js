import { logout } from './auth.js';

/**
 * Navigation Module
 * Fetches HTML components and injects them into the application shell.
 */

export async function initNavigation() {
 const sidebarContainer = document.getElementById('sidebar-container');
 const topbarContainer = document.getElementById('topbar-container');
 
 // Fetch and inject Sidebar
 if (sidebarContainer) {
  try {
   const response = await fetch('../components/sidebar.html');
   const html = await response.text();
   sidebarContainer.innerHTML = html;
   highlightActiveLink(sidebarContainer);
   setupSidebarToggle();
  } catch (error) {
   sidebarContainer.innerHTML = '<div class="error-state">Failed to load navigation</div>';
   console.error('Sidebar load error:', error);
  }
 }
 
 // Fetch and inject Topbar
 if (topbarContainer) {
  try {
   const response = await fetch('../components/topbar.html');
   const html = await response.text();
   topbarContainer.innerHTML = html;
   setupTopbarActions();
  } catch (error) {
   topbarContainer.innerHTML = '<div class="error-state">Failed to load topbar</div>';
   console.error('Topbar load error:', error);
  }
 }
}

function highlightActiveLink(container) {
 const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
 const links = container.querySelectorAll('.nav-link');
 
 links.forEach(link => {
  const href = link.getAttribute('href').split('/').pop();
  if (href === currentPage) {
   link.classList.add('active');
  }
 });
}

function setupSidebarToggle() {
 const sidebar = document.getElementById('sidebar-container');
 const toggleBtn = document.getElementById('sidebar-toggle');
 
 if (toggleBtn && sidebar) {
  toggleBtn.addEventListener('click', () => {
   sidebar.classList.toggle('open');
  });
 }
}

function setupTopbarActions() {
 const logoutBtn = document.getElementById('logout-btn');
 if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
   logout();
  });
 }
}