// JavaScript for the Directory page

// DOM elements
const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");
const directoryContainer = document.getElementById("directory-container");

// Add event listeners for grid/list toggle buttons
gridBtn.addEventListener("click", () => {
  setView("grid");
});

listBtn.addEventListener("click", () => {
  setView("list");
});

// Function to set the current view
function setView(viewType) {
  if (viewType === "grid") {
    directoryContainer.classList.remove("list-view");
    directoryContainer.classList.add("grid-view");
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");

    // Store the preference in localStorage
    localStorage.setItem("directoryView", "grid");
  } else {
    directoryContainer.classList.remove("grid-view");
    directoryContainer.classList.add("list-view");
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");

    // Store the preference in localStorage
    localStorage.setItem("directoryView", "list");
  }
}

// Function to get membership level class and text
function getMembershipLevel(level) {
  switch (level) {
    case 1:
      return { class: "member", text: "Member" };
    case 2:
      return { class: "silver", text: "Silver" };
    case 3:
      return { class: "gold", text: "Gold" };
    default:
      return { class: "member", text: "Member" };
  }
}

// Function to display businesses in grid view
function displayBusinessesGrid(businesses) {
  directoryContainer.innerHTML = "";

  businesses.forEach((business) => {
    const section = document.createElement("section");
    const membership = getMembershipLevel(business.membershipLevel);

    section.innerHTML = `
      <img src="${business.image}" alt="${business.name}" onerror="this.src='https://placehold.co/600x400/000000/FFFFFF/png'">
      <h3>${business.name}</h3>
      <p>${business.address}</p>
      <p>${business.phone}</p>
      <p class="membership-level ${membership.class}">${membership.text}</p>
      <a href="${business.website}" target="_blank">Visit Website</a>
    `;

    directoryContainer.appendChild(section);
  });
}

// Function to display businesses in list view
function displayBusinessesList(businesses) {
  directoryContainer.innerHTML = "";

  businesses.forEach((business) => {
    const section = document.createElement("section");
    const membership = getMembershipLevel(business.membershipLevel);

    section.innerHTML = `
      <h3>${business.name}</h3>
      <div>
        <p>${business.address}</p>
        <p>${business.phone}</p>
      </div>
      <div>
        <p class="membership-level ${membership.class}">${membership.text}</p>
        <a href="${business.website}" target="_blank">Visit Website</a>
      </div>
    `;

    directoryContainer.appendChild(section);
  });
}

// Function to display businesses based on current view
function displayBusinesses(businesses) {
  if (directoryContainer.classList.contains("grid-view")) {
    displayBusinessesGrid(businesses);
  } else {
    displayBusinessesList(businesses);
  }
}

// Async function to fetch the JSON data
async function getBusinessData() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.members;
  } catch (error) {
    console.error("Error fetching the business data:", error);
    return [];
  }
}

// Initialize the directory page
async function initDirectory() {
  // Get saved view preference or default to grid
  const savedView = localStorage.getItem("directoryView") || "grid";

  // Set view based on saved preference
  setView(savedView);

  // Fetch business data
  const businesses = await getBusinessData();

  // Display businesses
  displayBusinesses(businesses);
}

// Run initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initDirectory);