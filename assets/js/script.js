// Replace 'YOUR_API_KEY' with your actual API key
const apiKey = '21a46f90b8a043e6c1fed3e11137f2ff';
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('button');
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q={CITY_NAME}&appid=${apiKey}`;

searchButton.addEventListener('click', () => {
  const cityName = searchInput.value;
  if (cityName) {
    const forecastUrl = apiUrl.replace('{CITY_NAME}', cityName);

    // Fetch the weather forecast data for the searched city
    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
        const forecastList = data.list;
        const cards = document.querySelectorAll('.card');

        // Iterate over the forecast data and populate each card
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const forecast = forecastList[i * 8]; // Retrieve forecast for every 24 hours (8 data points per day)

          const dateElement = card.querySelector('.date');
          const tempElement = card.querySelector('.temp');
          const iconElement = card.querySelector('.icon');
          const descriptionElement = card.querySelector('.description');
          const humidityElement = card.querySelector('.humidity');
          const windElement = card.querySelector('.wind');

          // Format the date
          const date = new Date(forecast.dt * 1000); // Multiply by 1000 to convert from seconds to milliseconds
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

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
          card.querySelector('.weather').classList.remove('loading');
        }
      })
      .catch(error => {
        console.log('An error occurred while fetching the weather data:', error);
      });
  }
});