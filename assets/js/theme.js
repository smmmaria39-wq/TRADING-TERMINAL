/**
 * Theme Manager
 * Handles dark/light mode toggling and persistence.
 */
class ThemeManager {
 constructor() {
  this.theme = localStorage.getItem('theme') || 'dark';
  this.applyTheme(this.theme);
 }
 
 applyTheme(theme) {
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('theme', theme);
 }
 
 toggleTheme() {
  this.theme = this.theme === 'dark' ? 'light' : 'dark';
  this.applyTheme(this.theme);
 }
 
 init() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
   toggleBtn.addEventListener('click', () => this.toggleTheme());
  }
 }
}

export const themeManager = new ThemeManager();
export default themeManager;