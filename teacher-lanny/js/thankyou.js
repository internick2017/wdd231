// thankyou.js - JavaScript for the thank you page functionality
import { toggleMenu, getFromLocalStorage, formatDate } from "./utils.js";

// DOM Elements
const hamburgerBtn = document.getElementById("hamburgerBtn");
const primaryNav = document.getElementById("primaryNav");
const formDataDisplay = document.getElementById("formDataDisplay");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Setup mobile menu toggle
  hamburgerBtn.addEventListener("click", () => {
    toggleMenu(primaryNav);
  });

  // Display form data if available
  displayFormData();
});

/**
 * Display submitted form data
 */
function displayFormData() {
  if (!formDataDisplay) return;

  // Get form data from localStorage
  const formData = getFromLocalStorage("contactFormData");

  if (!formData) {
    formDataDisplay.innerHTML = "<p>No form data available.</p>";
    return;
  }

  // Create HTML for form data display
  let html = "<h3>Your Submission</h3>";

  // Name
  if (formData.name) {
    html += `<p><strong>Name:</strong> ${formData.name}</p>`;
  }

  // Email
  if (formData.email) {
    html += `<p><strong>Email:</strong> ${formData.email}</p>`;
  }

  // Phone
  if (formData.phone) {
    html += `<p><strong>Phone:</strong> ${formData.phone}</p>`;
  }

  // Service
  if (formData.serviceText) {
    html += `<p><strong>Service Interested In:</strong> ${formData.serviceText}</p>`;
  }

  // Newsletter
  html += `<p><strong>Newsletter Subscription:</strong> ${
    formData.newsletter ? "Yes" : "No"
  }</p>`;

  // Message
  if (formData.message) {
    html += `<p><strong>Your Message:</strong></p>`;
    html += `<p class="form-message">${formData.message}</p>`;
  }

  // Timestamp
  if (formData.timestamp) {
    html += `<p><strong>Submitted:</strong> ${formatDate(
      formData.timestamp
    )}</p>`;
  }

  // Update the display
  formDataDisplay.innerHTML = html;
}

export { displayFormData };