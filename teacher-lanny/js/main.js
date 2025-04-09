// main.js - Main JavaScript file for Teacher Lanny website
import { toggleMenu } from "./utils.js";

// DOM Elements
const hamburgerBtn = document.getElementById("hamburgerBtn");
const primaryNav = document.getElementById("primaryNav");
const wordDisplay = document.getElementById("word-display");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Setup mobile menu toggle
  hamburgerBtn.addEventListener("click", () => {
    toggleMenu(primaryNav);
  });

  // If we're on the home page, fetch a random word for the "Word of the Day" section
  if (wordDisplay) {
    loadRandomWord();
  }
});

// Function to fetch a random word from a predefined list for the home page
async function loadRandomWord() {
  try {
    const commonWords = [
      "education",
      "language",
      "learning",
      "practice",
      "fluency",
      "communicate",
      "vocabulary",
      "grammar",
      "pronunciation",
      "progress",
    ];

    // Select a random word from the array
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    const randomWord = commonWords[randomIndex];

    // Fetch the word definition from the dictionary API
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch word data");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const word = data[0];
      const definition = word.meanings[0].definitions[0].definition;

      // Update the word display section
      wordDisplay.innerHTML = `
                <div class="wod-content">
                    <p class="wod-word">${word.word}</p>
                    <p class="wod-definition">${definition}</p>
                    <a href="dictionary.html?word=${word.word}" class="btn-secondary">Learn More</a>
                </div>
            `;
    }
  } catch (error) {
    console.error("Error fetching random word:", error);
    wordDisplay.innerHTML = `
            <p>Discover new words and their meanings with our dictionary tool!</p>
            <a href="dictionary.html" class="btn-secondary">Explore Dictionary</a>
        `;
  }
}

// Export any functions that might be needed in other modules
export { loadRandomWord };