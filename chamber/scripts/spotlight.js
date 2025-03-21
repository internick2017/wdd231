// JavaScript for the Business Spotlights functionality

// DOM elements
const spotlightsContainer = document.getElementById("spotlights-container");

// Function to shuffle array elements randomly (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get membership level class and text
function getMembershipLevel(level) {
  switch (level) {
    case 2:
      return { class: "silver", text: "Silver" };
    case 3:
      return { class: "gold", text: "Gold" };
    default:
      return { class: "", text: "Member" };
  }
}

// Function to display spotlight businesses
function displaySpotlights(businesses) {
  // Clear previous spotlights
  spotlightsContainer.innerHTML = "";

  // Create spotlight cards
  businesses.forEach((business) => {
    const membership = getMembershipLevel(business.membershipLevel);

    const spotlightCard = document.createElement("div");
    spotlightCard.className = "spotlight-card";

    spotlightCard.innerHTML = `
      <img src="${business.image}" alt="${business.name} logo" class="spotlight-logo" onerror="this.src='https://placehold.co/600x400/000000/FFFFFF/png'">
      <h3>${business.name}</h3>
      <p>${business.address}</p>
      <p>${business.phone}</p>
      <p class="spotlight-membership ${membership.class}">${membership.text} Member</p>
      <a href="${business.website}" target="_blank" class="spotlight-website">Visit Website</a>
    `;

    spotlightsContainer.appendChild(spotlightCard);
  });
}

// Async function to fetch the JSON data and select random gold/silver members
async function getSpotlightBusinesses() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Filter for gold and silver members only (membership levels 2 or 3)
    const eligibleMembers = data.members.filter(
      (member) => member.membershipLevel === 3 || member.membershipLevel === 2
    );

    // Shuffle the array of eligible members
    const shuffledMembers = shuffleArray(eligibleMembers);

    // Take just 2 or 3 random members (depending on screen size)
    // For simplicity, we'll take 3 (or fewer if there aren't enough eligible members)
    const numberOfSpotlights = Math.min(3, shuffledMembers.length);
    return shuffledMembers.slice(0, numberOfSpotlights);
  } catch (error) {
    console.error("Error fetching the business data:", error);
    return [];
  }
}

// Initialize the spotlights when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  const spotlightBusinesses = await getSpotlightBusinesses();

  if (spotlightBusinesses.length > 0) {
    displaySpotlights(spotlightBusinesses);
  } else {
    spotlightsContainer.innerHTML =
      "<p>No spotlight businesses available at this time.</p>";
  }
});