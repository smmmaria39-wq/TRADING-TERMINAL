export const getElement = (id) => document.getElementById(id);

export const injectHTML = (container, html) => {
 if (container) container.innerHTML = html;
};

export const showLoading = (container) => {
 injectHTML(container, '<div class="loading-state">Loading data...</div>');
};

export const showEmpty = (container, message = 'No data available') => {
 injectHTML(container, `<div class="empty-state">${message}</div>`);
};

export const showError = (container, message = 'Unable to load data') => {
 injectHTML(container, `<div class="error-state">${message}</div>`);
};