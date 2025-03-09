// navigation.js - Controls the responsive navigation menu

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-btn');
    const primaryNav = document.getElementById('primary-nav');

    // Toggle menu when hamburger button is clicked
    menuButton.addEventListener('click', () => {
        primaryNav.classList.toggle('open');
        menuButton.setAttribute('aria-expanded',
            primaryNav.classList.contains('open')
        );
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !primaryNav.contains(e.target)) {
            primaryNav.classList.remove('open');
            menuButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage ||
            (currentPage === '' && linkPage === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });
});