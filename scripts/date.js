// date.js - For handling date-related content in the footer

document.addEventListener("DOMContentLoaded", () => {
  // Set the current year for copyright
  const currentYearElement = document.getElementById("current-year");
  const currentYear = new Date().getFullYear();
  currentYearElement.textContent = currentYear;

  // Set the last modified date
  const lastModifiedElement = document.getElementById("lastModified");
  lastModifiedElement.textContent = `Last Update: ${document.lastModified}`;
});
