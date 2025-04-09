// contact.js - JavaScript for the contact page functionality
import { toggleMenu, saveToLocalStorage } from './utils.js';

// DOM Elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');
const contactForm = document.getElementById('contactForm');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Setup mobile menu toggle
    hamburgerBtn.addEventListener('click', () => {
        toggleMenu(primaryNav);
    });

    // Setup contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Handle contact form submission
 * @param {Event} event - The submit event
 */
function handleFormSubmit(event) {
    // Don't prevent default form submission, but save form data to localStorage
    // so we can display it on the thank you page

    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };

    // Map service value to readable text
    const serviceMap = {
        'business': 'Business English',
        'academic': 'Academic English',
        'conversation': 'Conversational English',
        'writing': 'Writing Improvement',
        'pronunciation': 'Pronunciation Coaching',
        'other': 'Other'
    };

    // Update the service with readable text
    if (formData.service) {
        formData.serviceText = serviceMap[formData.service] || formData.service;
    }

    // Save form data to localStorage
    saveToLocalStorage('contactFormData', formData);
}

export { handleFormSubmit };