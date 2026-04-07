/**
 * Format price in Indian Rupees
 * @param {number} price - Price in rupees
 * @returns {string} Formatted price with ₹ symbol
 */
export const formatPrice = (price) => {
  if (!price) return '₹0';
  return `₹${new Intl.NumberFormat('en-IN').format(Math.round(price))}`;
};

/**
 * Format price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (min, max) => {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};
