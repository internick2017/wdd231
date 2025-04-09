// dictionary.js - JavaScript for the dictionary page functionality
import {
  toggleMenu,
  saveToLocalStorage,
  getFromLocalStorage,
  getUrlParams,
} from "./utils.js";

// DOM Elements
const hamburgerBtn = document.getElementById("hamburgerBtn");
const primaryNav = document.getElementById("primaryNav");
const dictionaryForm = document.getElementById("dictionaryForm");
const wordInput = document.getElementById("wordInput");
const resultsSection = document.getElementById("results-section");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const wordResults = document.getElementById("word-results");
const recentSearchesList = document.getElementById("recentSearchesList");
const wordOfDay = document.getElementById("wordOfDay");
const wordModal = document.getElementById("wordModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.querySelector(".close-modal");

// Constants
const MAX_RECENT_SEARCHES = 10;
const STORAGE_KEY = "recent_searches";
const WORD_OF_DAY_KEY = "word_of_day";

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Setup mobile menu toggle
  hamburgerBtn.addEventListener("click", () => {
    toggleMenu(primaryNav);
  });

  // Load recent searches
  loadRecentSearches();

  // Setup dictionary form submission
  dictionaryForm.addEventListener("submit", handleFormSubmit);

  // Close modal when clicking the x
  closeModal.addEventListener("click", () => {
    wordModal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === wordModal) {
      wordModal.style.display = "none";
    }
  });

  // Check if there's a word parameter in the URL
  const params = getUrlParams();
  if (params.word) {
    wordInput.value = params.word;
    searchWord(params.word);
  }

  // Load Word of the Day
  loadWordOfDay();
});

/**
 * Handle dictionary form submission
 * @param {Event} event - The submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const word = wordInput.value.trim().toLowerCase();

  if (word) {
    searchWord(word);
  }
}

/**
 * Search for a word using the dictionary API
 * @param {string} word - The word to search for
 */
async function searchWord(word) {
  // Show loading spinner, hide results and error
  loading.classList.remove("hidden");
  wordResults.classList.add("hidden");
  errorMessage.classList.add("hidden");

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error(`Word not found: ${word}`);
    }

    const data = await response.json();

    // Add to recent searches
    addToRecentSearches(word);

    // Display the results
    displayWordResults(data[0]);
  } catch (error) {
    console.error("Error fetching word data:", error);
    errorMessage.textContent = `Sorry, we couldn't find the word "${word}". Please try another word.`;
    errorMessage.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

/**
 * Display word results in the UI
 * @param {Object} wordData - The word data from the API
 */
function displayWordResults(wordData) {
  if (!wordData) return;

  let audioUrl = "";
  // Find an audio file if available
  if (wordData.phonetics) {
    for (const phonetic of wordData.phonetics) {
      if (phonetic.audio && phonetic.audio.trim() !== "") {
        audioUrl = phonetic.audio;
        break;
      }
    }
  }

  // Start building the HTML for word results
  let html = `
        <div class="word-header">
            <div class="word-title">
                <h2>${wordData.word}</h2>
                ${
                  wordData.phonetic
                    ? `<span class="phonetic">${wordData.phonetic}</span>`
                    : ""
                }
            </div>
            ${
              audioUrl
                ? `
                <button class="audio-btn" data-audio="${audioUrl}" aria-label="Listen to pronunciation">
                    ♪
                </button>
            `
                : ""
            }
        </div>
        <div class="word-meanings">
    `;

  // Add each meaning (part of speech, definitions, etc.)
  if (wordData.meanings && wordData.meanings.length > 0) {
    wordData.meanings.forEach((meaning) => {
      html += `
                <div class="meaning">
                    <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
            `;

      // Add definitions
      if (meaning.definitions && meaning.definitions.length > 0) {
        meaning.definitions.forEach((def, index) => {
          if (index < 3) {
            // Limit to first 3 definitions to keep it concise
            html += `
                            <div class="definition-container">
                                <div class="definition">${index + 1}. ${
              def.definition
            }</div>
                                ${
                                  def.example
                                    ? `<div class="example">"${def.example}"</div>`
                                    : ""
                                }
                            </div>
                        `;
          }
        });

        // Add "See more" button if there are more than 3 definitions
        if (meaning.definitions.length > 3) {
          html += `
                        <button class="btn-secondary view-more-btn" data-word="${wordData.word}">
                            See all ${meaning.definitions.length} definitions
                        </button>
                    `;
        }
      }

      // Add synonyms if available
      if (meaning.synonyms && meaning.synonyms.length > 0) {
        html += `<div class="synonyms">Synonyms: `;
        meaning.synonyms.slice(0, 5).forEach((synonym) => {
          html += `<span>${synonym}</span> `;
        });
        html += `</div>`;
      }

      // Add antonyms if available
      if (meaning.antonyms && meaning.antonyms.length > 0) {
        html += `<div class="antonyms">Antonyms: `;
        meaning.antonyms.slice(0, 5).forEach((antonym) => {
          html += `<span>${antonym}</span> `;
        });
        html += `</div>`;
      }

      html += `
                </div>
            `;
    });
  }

  html += `</div>`;

  // Update the results container
  wordResults.innerHTML = html;
  wordResults.classList.remove("hidden");

  // Add click event for audio button
  const audioBtn = wordResults.querySelector(".audio-btn");
  if (audioBtn) {
    audioBtn.addEventListener("click", playAudio);
  }

  // Add click event for "See more" buttons
  const viewMoreBtns = wordResults.querySelectorAll(".view-more-btn");
  viewMoreBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(wordData);
    });
  });
}

/**
 * Play audio pronunciation
 * @param {Event} event - The click event
 */
function playAudio(event) {
  const audioUrl = event.target.getAttribute("data-audio");
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}

/**
 * Open modal with detailed word information
 * @param {Object} wordData - The complete word data
 */
function openModal(wordData) {
  if (!wordData) return;

  let html = `
        <div class="word-header">
            <div class="word-title">
                <h2>${wordData.word}</h2>
                ${
                  wordData.phonetic
                    ? `<span class="phonetic">${wordData.phonetic}</span>`
                    : ""
                }
            </div>
        </div>
    `;

  // Add origin if available
  if (wordData.origin) {
    html += `<div class="word-origin"><strong>Origin:</strong> ${wordData.origin}</div>`;
  }

  // Add all meanings with all definitions
  if (wordData.meanings && wordData.meanings.length > 0) {
    html += `<div class="word-meanings">`;

    wordData.meanings.forEach((meaning) => {
      html += `
                <div class="meaning">
                    <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
            `;

      // Add all definitions
      if (meaning.definitions && meaning.definitions.length > 0) {
        meaning.definitions.forEach((def, index) => {
          html += `
                        <div class="definition-container">
                            <div class="definition">${index + 1}. ${
            def.definition
          }</div>
                            ${
                              def.example
                                ? `<div class="example">"${def.example}"</div>`
                                : ""
                            }
                        </div>
                    `;
        });
      }

      // Add all synonyms if available
      if (meaning.synonyms && meaning.synonyms.length > 0) {
        html += `<div class="synonyms">Synonyms: `;
        meaning.synonyms.forEach((synonym) => {
          html += `<span>${synonym}</span> `;
        });
        html += `</div>`;
      }

      // Add all antonyms if available
      if (meaning.antonyms && meaning.antonyms.length > 0) {
        html += `<div class="antonyms">Antonyms: `;
        meaning.antonyms.forEach((antonym) => {
          html += `<span>${antonym}</span> `;
        });
        html += `</div>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
  }

  // Update modal content and display it
  modalContent.innerHTML = html;
  wordModal.style.display = "block";
}

/**
 * Add a word to recent searches
 * @param {string} word - The word to add
 */
function addToRecentSearches(word) {
  // Get existing searches
  let searches = getFromLocalStorage(STORAGE_KEY, []);

  // Remove the word if it already exists
  searches = searches.filter((item) => item !== word);

  // Add the new word at the beginning
  searches.unshift(word);

  // Keep only the MAX_RECENT_SEARCHES most recent
  if (searches.length > MAX_RECENT_SEARCHES) {
    searches = searches.slice(0, MAX_RECENT_SEARCHES);
  }

  // Save back to localStorage
  saveToLocalStorage(STORAGE_KEY, searches);

  // Update the UI
  loadRecentSearches();
}

/**
 * Load and display recent searches
 */
function loadRecentSearches() {
  const searches = getFromLocalStorage(STORAGE_KEY, []);

  if (searches.length === 0) {
    recentSearchesList.innerHTML = "<li>No recent searches</li>";
    return;
  }

  recentSearchesList.innerHTML = searches
    .map((word) => `<li data-word="${word}">${word}</li>`)
    .join("");

  // Add click events to recent search items
  const searchItems = recentSearchesList.querySelectorAll("li");
  searchItems.forEach((item) => {
    if (item.hasAttribute("data-word")) {
      item.addEventListener("click", () => {
        const word = item.getAttribute("data-word");
        wordInput.value = word;
        searchWord(word);
      });
    }
  });
}

/**
 * Load or generate Word of the Day
 */
async function loadWordOfDay() {
  try {
    // Check if we already have a word of the day saved
    const savedWOD = getFromLocalStorage(WORD_OF_DAY_KEY);
    const today = new Date().toDateString();

    // If we have a saved word and it's from today, use it
    if (savedWOD && savedWOD.date === today) {
      displayWordOfDay(savedWOD.word);
      return;
    }

    // Otherwise, get a new word
    const commonWords = [
      "serendipity",
      "eloquent",
      "perseverance",
      "magnificent",
      "innovation",
      "resilience",
      "brilliant",
      "compassion",
      "integrity",
      "perspective",
    ];

    const randomIndex = Math.floor(Math.random() * commonWords.length);
    const randomWord = commonWords[randomIndex];

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch word data");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      // Save to localStorage for today
      saveToLocalStorage(WORD_OF_DAY_KEY, {
        date: today,
        word: data[0],
      });

      displayWordOfDay(data[0]);
    }
  } catch (error) {
    console.error("Error fetching word of the day:", error);
    // Display fallback message
    wordOfDay.innerHTML = `
            <p>Check back each day for a new featured word to expand your vocabulary!</p>
        `;
  }
}

/**
 * Display Word of the Day in the UI
 * @param {Object} wordData - The word data from the API
 */
function displayWordOfDay(wordData) {
  if (!wordData) return;

  // Get the first definition
  const firstMeaning =
    wordData.meanings && wordData.meanings.length > 0
      ? wordData.meanings[0]
      : null;
  const firstDefinition =
    firstMeaning && firstMeaning.definitions.length > 0
      ? firstMeaning.definitions[0].definition
      : "";

  const html = `
        <div class="wod-content">
            <p class="wod-word">${wordData.word} ${
    wordData.phonetic
      ? `<span class="phonetic">${wordData.phonetic}</span>`
      : ""
  }</p>
            <p class="wod-pos">${
              firstMeaning ? firstMeaning.partOfSpeech : ""
            }</p>
            <p class="wod-definition">${firstDefinition}</p>
            <button class="view-details-btn" data-word="${
              wordData.word
            }">View Full Details</button>
        </div>
    `;

  wordOfDay.innerHTML = html;

  // Add click event for the details button
  const detailsBtn = wordOfDay.querySelector(".view-details-btn");
  if (detailsBtn) {
    detailsBtn.addEventListener("click", () => {
      openModal(wordData);
    });
  }
}