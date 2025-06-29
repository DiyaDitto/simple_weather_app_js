const locationInput = document.getElementById('locationInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherInfo = document.getElementById('weather-info');
const unitToggle = document.getElementById('unitToggle');

let isCelsius = true;

getWeatherBtn.addEventListener('click', () => getWeather());
unitToggle.addEventListener('change', () => {
  isCelsius = !isCelsius;
  getWeather(); // refresh data
});

async function getWeather() {
  const location = locationInput.value.trim();
  if (!location) {
    weatherInfo.innerHTML = `<p>Please enter a location.</p>`;
    return;
  }

  try {
    const unit = isCelsius ? 'metric' : 'imperial';
    const response = await fetch(`/api/weather?location=${location}&units=${unit}`);
    const data = await response.json();

    if (data.error) {
      weatherInfo.innerHTML = `<p>${data.error}</p>`;
    } else {
      displayWeather(data);
    }
  } catch (err) {
    console.error(err);
    weatherInfo.innerHTML = `<p>Failed to fetch weather. Try again later.</p>`;
  }
}

function displayWeather(data) {
  const tempUnit = isCelsius ? '°C' : '°F';
  const weatherHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><strong>🌡️ Temp:</strong> ${data.main.temp}${tempUnit}</p>
    <p><strong>🌥️ Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>🌬️ Wind:</strong> ${data.wind.speed} m/s</p>
  `;
  weatherInfo.innerHTML = weatherHTML;
}
