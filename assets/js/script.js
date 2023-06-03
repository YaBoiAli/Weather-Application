const apiKey = "21a46f90b8a043e6c1fed3e11137f2ff";
const searchInput = document.querySelector(".search-bar");
const searchButton = document.querySelector("button");
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q={CITY_NAME}&appid=${apiKey}`;

const clearElement = document.querySelector(".clear");

clearElement.addEventListener("click", () => {
  localStorage.removeItem("previousSearches");
  location.reload();
});

// Retrieve previous searches from local storage
const previousSearches =
  JSON.parse(localStorage.getItem("previousSearches")) || [];
const previousDiv = document.querySelector(".prevbtn");

// Function to save previous searches to local storage
const savePreviousSearches = () => {
  localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
};

const searchArray = [];

const variable = {};

//function to call inside the main function for search
const noRepeatSearch = () => {
  for (var i = 0; i < previousSearches.length; i++) {
    const searchedCity = previousSearches[i];
    if (!variable[searchedCity]) {
      variable[searchedCity] = true;
      searchArray.push(searchedCity);
    }
  }
};



const performSearch = (cityName) => {
  searchInput.value = cityName;
  searchButton.click();
};

noRepeatSearch();
// Print the previous searches in the results div
searchArray.forEach((search) => {
  const searchItem = document.createElement("button");
  searchItem.classList.add("preBtn");
  searchItem.textContent = search;
  searchItem.addEventListener("click", () => {
    performSearch(search);
  });
  previousDiv.appendChild(searchItem);
});

//Search Button clicked
searchButton.addEventListener("click", () => {
  const cityName = searchInput.value;

  if (cityName) {
    previousSearches.unshift(cityName); // Add the searched city to the beginning of the array

    previousDiv.innerHTML = "";

    noRepeatSearch();


    searchArray.forEach((search) => {
      const searchItem = document.createElement("button");
      searchItem.classList.add("preBtn");
      searchItem.textContent = search;
      searchItem.addEventListener("click", () => {
        performSearch(search);
      });
      previousDiv.appendChild(searchItem);
    });
    //saving and diplaying the previous code
    savePreviousSearches();

    const forecastUrl = apiUrl.replace("{CITY_NAME}", cityName);

    // Fetch the weather forecast data for the searched city
    fetch(forecastUrl)
      .then((response) => response.json())
      .then((data) => {
        const forecastList = data.list;
        const cards = document.querySelectorAll(".card");

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to midnight

        // Iterate over the forecast data and populate each card
        for (let i = 0; i < 6; i++) {
          const forecast = forecastList[i]; // Retrieve forecast for each day

          const card = cards[i];

          const dateElement = card.querySelector(".date");
          const tempElement = card.querySelector(".temp");
          const iconElement = card.querySelector(".icon");
          const descriptionElement = card.querySelector(".description");
          const humidityElement = card.querySelector(".humidity");
          const windElement = card.querySelector(".wind");

          // Calculate the date for the current card
          const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000); // Add i days to today's date

          // Format the date
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          // Extract and convert temperature from Kelvin to Celsius
          const temp = Math.round(forecast.main.temp - 273.15);

          // Get the weather icon URL
          const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

          // Extract other forecast details
          const description = forecast.weather[0].description;
          const humidity = forecast.main.humidity;
          const windSpeed = forecast.wind.speed;

          // Update the card with the forecast data
          dateElement.textContent = formattedDate;
          tempElement.textContent = `${temp}°C`;
          iconElement.src = iconUrl;
          descriptionElement.textContent = description;
          humidityElement.textContent = `Humidity: ${humidity}%`;
          windElement.textContent = `Wind Speed: ${windSpeed}km/hr`;

          // Remove the 'loading' class to display the forecast
          card.querySelector(".weather").classList.remove("loading");
        }
      })
      .catch((error) => {
        console.log(
          "An error occurred while fetching the weather data:",
          error
        );
        alert("City not found. Please enter a valid city name.");
      });
  }
});
