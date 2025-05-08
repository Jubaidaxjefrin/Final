document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const countryInput = document.getElementById("country-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsContainer = document.getElementById("results-container");
  const loadingElement = document.getElementById("loading");
  const errorMessage = document.getElementById("error-message");

  // Event listenerss
  searchBtn.addEventListener("click", searchCountry);
  countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchCountry();
    }
  });

  // Function to search for country
  async function searchCountry() {
    const countryName = countryInput.value.trim();

    if (!countryName) {
        showError("Please enter a country name");
        return;
     }

    // Show loading indicator and hide any previous error
    showLoading(true);
    hideError();

    // Clear previous results
    resultsContainer.innerHTML = "";

    try {
        const data = await fetchCountryData(countryName);
        showLoading(false);

        if (data.length === 0) {
            showError("No countries found with that name");
            return;
        }

        // Display the results
        displayResults(data);
    } catch (error) {
        showLoading(false);
        showError("Error fetching country data. Please try again.");
        console.error("Error:", error);
    }
  }
// Function to fetch country data from API
async function fetchCountryData(countryName) {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

// Function to display results
function displayResults(countries) {
  countries.forEach((country) => {
    // Extract basic data
    const name = country.name.common;
    const capital = country.capital ? country.capital.join(", ") : "N/A";
    const flagUrl = country.flags.svg;
    
    // Create a simple country card
    const countryCard = document.createElement("div");
    countryCard.className = "country-card";

    countryCard.innerHTML = `
      <div class="flag-container">
        <img src="${flagUrl}" alt="Flag of ${name}">
      </div>
      <div class="country-info">
        <h2 class="country-name">${name}</h2>
        <div class="info-item">
          <span class="info-label">Capital:</span>
          <span class="info-value">${capital}</span>
        </div>
      </div>
    `;

    resultsContainer.appendChild(countryCard);
  });
}

  // Helper functions
  function showLoading(show) {
    loadingElement.classList.toggle("hidden", !show);
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }

  function hideError() {
    errorMessage.classList.add("hidden");
  }
  

});