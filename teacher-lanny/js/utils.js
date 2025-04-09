// utils.js - Utility functions for Teacher Lanny website

/**
 * Toggle the mobile navigation menu
 * @param {HTMLElement} navElement - The navigation element to toggle
 */
function toggleMenu(navElement) {
  navElement.classList.toggle("open");
}

/**
 * Save data to localStorage
 * @param {string} key - The key to store the data under
 * @param {any} data - The data to store
 */
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Retrieve data from localStorage
 * @param {string} key - The key to retrieve data from
 * @param {any} defaultValue - Default value to return if key doesn't exist
 * @returns {any} The retrieved data or default value
 */
function getFromLocalStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Format a date as a string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

/**
 * Get URL parameters
 * @returns {Object} Object containing URL parameters
 */
function getUrlParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - Time in milliseconds to wait between calls
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export all utility functions
export {
  toggleMenu,
  saveToLocalStorage,
  getFromLocalStorage,
  formatDate,
  getUrlParams,
  debounce,
};