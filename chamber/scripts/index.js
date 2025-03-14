// Main JavaScript file for Chamber of Commerce site

// Function to toggle the navigation menu
function toggleMenu() {
    document.getElementById('primary-nav').classList.toggle('open');
  }

  // Set the current date in the header
  function setCurrentDate() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
  }

  // Set the current year in the footer
  function setCurrentYear() {
    const year = new Date().getFullYear();
    document.getElementById('current-year').textContent = year;
  }

  // Set the last modified date in the footer
  function setLastModified() {
    document.getElementById('last-modified').textContent = document.lastModified;
  }

  // Run functions when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to hamburger menu button
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener('click', toggleMenu);
    }

    // Set dates and years
    setCurrentDate();
    setCurrentYear();
    setLastModified();
  });