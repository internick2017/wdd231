// discover.js - Script for the Discover page

// Get the visitor message element
const visitorMessage = document.getElementById("visitor-message");
const discoverGrid = document.getElementById("discover-grid");

// Function to check and display visitor message
function checkLastVisit() {
  const now = Date.now();
  const lastVisit = localStorage.getItem("lastVisit");

  // Display appropriate message based on visit history
  if (!lastVisit) {
    // First visit
    visitorMessage.textContent =
      "Welcome! Let us know if you have any questions.";
  } else {
    const daysSinceLastVisit = Math.floor(
      (now - lastVisit) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastVisit < 1) {
      // Less than a day
      visitorMessage.textContent = "Back so soon! Awesome!";
    } else {
      // More than a day
      const dayText = daysSinceLastVisit === 1 ? "day" : "days";
      visitorMessage.textContent = `You last visited ${daysSinceLastVisit} ${dayText} ago.`;
    }
  }

  // Update last visit date to current date
  localStorage.setItem("lastVisit", now);
}

// Function to load discover items from JSON file
async function loadDiscoverItems() {
  try {
    const response = await fetch("./data/discover.json");
    if (!response.ok) {
      throw new Error("Failed to fetch discover data");
    }

    const data = await response.json();
    displayDiscoverItems(data.places);
  } catch (error) {
    console.error("Error loading discover items:", error);
    discoverGrid.innerHTML =
      '<p class="error-message">Unable to load discover items. Please try again later.</p>';
  }
}

// Function to display discover items
function displayDiscoverItems(places) {
  discoverGrid.innerHTML = "";

  places.forEach((place) => {
    const card = document.createElement("div");
    card.className = "discover-card";

    card.innerHTML = `
            <figure>
                <img src="${place.image}" alt="${place.name}" loading="lazy">
            </figure>
            <div class="card-content">
                <h3>${place.name}</h3>
                <address>${place.address}</address>
                <p>${place.description}</p>
                <button class="learn-more">Learn More</button>
            </div>
        `;

    // Add event listener to "Learn More" button
    const learnMoreBtn = card.querySelector(".learn-more");
    learnMoreBtn.addEventListener("click", () => {
      alert(`More information about ${place.name} coming soon!`);
    });

    discoverGrid.appendChild(card);
  });
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  checkLastVisit();
  loadDiscoverItems();
});
