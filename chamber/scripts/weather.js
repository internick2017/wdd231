// JavaScript for the Weather functionality

// OpenWeatherMap API Key - Replace with your actual API key
// NOTE: In a production environment, you should secure your API keys
const apiKey = "58c84bfd2d87d5706c46b7a6dc0154e7";

// City location - Set to Francisco Beltrão, Paraná, Brazil
const city = "Francisco Beltrão,PR,BR";

// DOM elements
const currentTemp = document.getElementById("current-temp");
const weatherIcon = document.getElementById("weather-icon");
const weatherDesc = document.getElementById("weather-desc");
const forecastContainer = document.getElementById("forecast-container");

// Function to capitalize every word in a string
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Function to format temperatures with no decimal points
function formatTemperature(temp) {
  return Math.round(temp);
}

// Function to get day name from date
function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Function to fetch current weather data
async function fetchCurrentWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Update current weather display
    currentTemp.textContent = formatTemperature(data.main.temp);

    // Handle multiple weather descriptions if they exist
    if (data.weather && data.weather.length > 0) {
      const descriptions = data.weather.map((item) =>
        capitalizeWords(item.description)
      );
      weatherDesc.textContent = descriptions.join(", ");

      // Set weather icon for the first weather condition
      const iconCode = data.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      weatherIcon.alt = descriptions[0];
    }
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    weatherDesc.textContent = "Weather data unavailable";
  }
}

// Function to fetch 3-day forecast
async function fetchForecast() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Process forecast data - we need one forecast per day for the next 3 days
    // OpenWeatherMap returns forecasts in 3-hour blocks, so we'll get the noon forecast for each day
    const dailyForecasts = {};

    // Get today's date and skip it in the forecast
    const today = new Date().toISOString().split("T")[0];

    // Process the forecast data
    data.list.forEach((forecast) => {
      const forecastDate = forecast.dt_txt.split(" ")[0];
      const forecastTime = forecast.dt_txt.split(" ")[1];

      // Skip today's forecasts
      if (forecastDate === today) return;

      // Get noon forecasts (closest to 12:00)
      if (forecastTime === "12:00:00" || !dailyForecasts[forecastDate]) {
        dailyForecasts[forecastDate] = forecast;
      }
    });

    // Convert to array and take only the first 3 days
    const forecastsArray = Object.values(dailyForecasts).slice(0, 3);

    // Clear previous forecasts
    forecastContainer.innerHTML = "";

    // Create forecast day elements
    forecastsArray.forEach((forecast) => {
      const dayName = getDayName(forecast.dt_txt);
      const temp = formatTemperature(forecast.main.temp);
      const iconCode = forecast.weather[0].icon;

      const forecastDay = document.createElement("div");
      forecastDay.className = "forecast-day";
      forecastDay.innerHTML = `
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${forecast.weather[0].description}">
        <p>${temp}°F</p>
      `;

      forecastContainer.appendChild(forecastDay);
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    forecastContainer.innerHTML = "<p>Forecast data unavailable</p>";
  }
}

// Initialize weather data when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  fetchCurrentWeather();
  fetchForecast();
});