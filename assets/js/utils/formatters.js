export const formatCurrency = (value) => {
 if (value === null || value === undefined) return '—';
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export const formatPrice = (value) => {
 if (value === null || value === undefined) return '—';
 return parseFloat(value).toFixed(5);
};

export const formatDate = (timestamp) => {
 if (!timestamp) return '—';
 return new Date(timestamp).toLocaleString();
};