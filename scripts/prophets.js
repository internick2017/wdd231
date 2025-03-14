// Declare the URL constant for the JSON data
const url =
  "https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json";

// Select the HTML div element with id of "cards"
const cards = document.querySelector("#cards");

// Asynchronous function to fetch prophet data
async function getProphetData() {
  // Fetch data from the JSON source URL
  const response = await fetch(url);

  // Convert the response to a JSON object
  const data = await response.json();

  // Call the displayProphets function with the prophets array
  displayProphets(data.prophets);
}

// Function to build and display prophet cards
const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create elements
    const card = document.createElement("section");
    const fullName = document.createElement("h2");
    const portrait = document.createElement("img");
    const birthdate = document.createElement("p");
    const birthplace = document.createElement("p");
    const death = document.createElement("p");
    const length = document.createElement("p");
    const order = document.createElement("p");

    // Populate the h2 element with the prophet's full name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Populate the information
    birthdate.textContent = `Date of Birth: ${prophet.birthdate}`;
    birthplace.textContent = `Place of Birth: ${prophet.birthplace}`;

    // Add death date if available
    if (prophet.death) {
      death.textContent = `Date of Death: ${prophet.death}`;
    } else {
      death.textContent = `Currently Serving`;
    }

    // Add years as prophet
    length.textContent = `Years as Prophet: ${prophet.length}`;

    // Add prophet number
    order.textContent = `${getOrdinal(prophet.order)} Latter-day President`;

    // Build the image by setting all the attributes
    portrait.setAttribute("src", prophet.imageurl);
    portrait.setAttribute(
      "alt",
      `Portrait of ${prophet.name} ${prophet.lastname} - ${getOrdinal(
        prophet.order
      )} Latter-day President`
    );
    portrait.setAttribute("loading", "lazy");
    portrait.setAttribute("width", "340");
    portrait.setAttribute("height", "440");

    // Append elements to the card
    card.appendChild(fullName);
    card.appendChild(order);
    card.appendChild(birthdate);
    card.appendChild(birthplace);
    card.appendChild(death);
    card.appendChild(length);
    card.appendChild(portrait);

    // Append the card to the cards div
    cards.appendChild(card);
  });
};

// Helper function to add ordinal suffix to numbers (1st, 2nd, 3rd, etc.)
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Call the function to fetch and display prophet data
getProphetData();
