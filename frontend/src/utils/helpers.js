/**
 * ShopGenie AI – Shared Utility Helpers
 */

/**
 * Format a number as currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount) || 0);
};

/**
 * Format a date/time string to human-readable
 */
export const formatDateTime = (dateStr, options = {}) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return 'N/A';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
};

/**
 * Clamp a number between min and max bounds
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Truncate string to given length with ellipsis
 */
export const truncate = (str, length = 50) =>
  str && str.length > length ? str.substring(0, length) + '...' : str;

/**
 * Generate a random hex ID (for temp IDs, not security)
 */
export const generateTempId = () => `tmp-${Math.random().toString(16).slice(2, 10)}`;

/**
 * Download a Blob as a file
 */
export const downloadBlob = (data, filename, mimeType = 'text/csv') => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Debounce a function call
 */
export const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get stock status label + CSS class
 */
export const getStockStatus = (qty, minLevel) => {
  if (qty === 0) return { label: 'OUT OF STOCK', className: 'text-rose-500 bg-rose-500/10 border-rose-500/30' };
  if (qty <= minLevel) return { label: 'LOW STOCK', className: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  return { label: 'IN STOCK', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
};
