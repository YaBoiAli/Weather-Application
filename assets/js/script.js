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

        // Get unique dates from the forecast data
        const uniqueDates = [...new Set(forecastList.map(forecast => forecast.dt_txt.split(' ')[0]))];

        // Iterate over the forecast data and populate each card
        uniqueDates.forEach((date, i) => {
          const card = cards[i];

          const dateElement = card.querySelector('.date');
          const tempElement = card.querySelector('.temp');
          const iconElement = card.querySelector('.icon');
          const descriptionElement = card.querySelector('.description');
          const humidityElement = card.querySelector('.humidity');
          const windElement = card.querySelector('.wind');

          // Format the date
          const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          // Filter forecast data for the current date
          const filteredForecast = forecastList.filter(forecast => forecast.dt_txt.split(' ')[0] === date);

          // Extract and convert temperature from Kelvin to Celsius
          const temp = Math.round(filteredForecast[0].main.temp - 273.15);

          // Get the weather icon URL
          const iconUrl = `https://openweathermap.org/img/wn/${filteredForecast[0].weather[0].icon}.png`;

          // Extract other forecast details
          const description = filteredForecast[0].weather[0].description;
          const humidity = filteredForecast[0].main.humidity;
          const windSpeed = filteredForecast[0].wind.speed;

          // Update the card with the forecast data
          dateElement.textContent = formattedDate;
          tempElement.textContent = `${temp}°C`;
          iconElement.src = iconUrl;
          descriptionElement.textContent = description;
          humidityElement.textContent = `Humidity: ${humidity}%`;
          windElement.textContent = `Wind Speed: ${windSpeed}km/hr`;

          // Remove the 'loading' class to display the forecast
          card.querySelector('.weather').classList.remove('loading');
        });
      })
      .catch(error => {
        console.log('An error occurred while fetching the weather data:', error);
      });
  }
});