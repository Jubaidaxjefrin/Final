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
      // TODO: Implement the API call to fetch country data
      console.log("Searching for:", countryName);
      
      // Placeholder for API call
      // Will be implemented in the next iteration
      
      showLoading(false);
      
    } catch (error) {
      showLoading(false);
      showError("Error fetching country data. Please try again.");
      console.error("Error:", error);
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
  
  // TODO: Implement the fetchCountryData function
  // TODO: Implement the displayResults function
});