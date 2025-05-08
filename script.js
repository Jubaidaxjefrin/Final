document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const countryInput = document.getElementById("country-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsContainer = document.getElementById("results-container");
  const loadingElement = document.getElementById("loading");
  const errorMessage = document.getElementById("error-message");

  // Event listeners
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
      
      // Scroll to results
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      showLoading(false);
      if (error.message.includes("404")) {
        showError(`No countries found with the name "${countryName}"`);
      } else {
        showError("Error fetching country data. Please try again.");
        console.error("Error:", error);
      }
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
      // Extract required data
      const name = country.name.common;
      const officialName = country.name.official;
      const capital = country.capital ? country.capital.join(", ") : "N/A";
      const flagUrl = country.flags.svg;
      const flagAlt = country.flags.alt || `Flag of ${name}`;

      // Currency (can be multiple)
      let currencyText = "N/A";
      if (country.currencies) {
        const currencyEntries = Object.entries(country.currencies);
        if (currencyEntries.length > 0) {
          currencyText = currencyEntries
            .map(([code, currency]) => `${currency.name} (${currency.symbol || code})`)
            .join(", ");
        }
      }

      // Additional data points
      const population = country.population.toLocaleString();
      const region = country.region;
      const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
      const area = country.area ? `${country.area.toLocaleString()} km²` : "N/A";
      const timezones = country.timezones ? country.timezones.join(", ") : "N/A";

      // Create country card
      const countryCard = document.createElement("div");
      countryCard.className = "country-card";

      countryCard.innerHTML = `
        <div class="flag-container">
          <img src="${flagUrl}" alt="${flagAlt}" loading="lazy">
        </div>
        <div class="country-info">
          <h2 class="country-name">${name}</h2>
          <div class="info-item">
            <span class="info-label">Official Name:</span>
            <span class="info-value">${officialName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Capital:</span>
            <span class="info-value">${capital}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Currency:</span>
            <span class="info-value">${currencyText}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Population:</span>
            <span class="info-value">${population}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Region:</span>
            <span class="info-value">${region}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Languages:</span>
            <span class="info-value">${languages}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Area:</span>
            <span class="info-value">${area}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Timezones:</span>
            <span class="info-value">${timezones}</span>
          </div>
        </div>
      `;

      resultsContainer.appendChild(countryCard);
    });
    
    // Add "back to top" button if there are multiple results
    if (countries.length > 1) {
      const backToTopBtn = document.createElement("button");
      backToTopBtn.className = "back-to-top";
      backToTopBtn.textContent = "Back to Top";
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      resultsContainer.appendChild(backToTopBtn);
    }
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