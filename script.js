const apiKey = '6c4b8b12818b280890874339e4ef4a6c';
const locationInput = document.getElementById('locationInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const geoWeatherBtn = document.getElementById('geoWeatherBtn');
const weatherInfo = document.getElementById('weather-info');

// Search by location name
getWeatherBtn.addEventListener('click', () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeatherByCity(location);
  } else {
    alert('Please enter a location.');
  }
});

// Search by geolocation
geoWeatherBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    weatherInfo.innerHTML = `<p>📍 Locating...</p>`;
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        weatherInfo.innerHTML = `<p style="color: red;">Geolocation permission denied.</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p style="color: red;">Geolocation is not supported.</p>`;
  }
});

// Fetch weather by city name
async function fetchWeatherByCity(city) {
  weatherInfo.innerHTML = `<p>Loading...</p>`;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);
    displayWeather(data);
  } catch (err) {
    weatherInfo.innerHTML = `<p style="color: red;">❌ ${err.message}</p>`;
  }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);
    displayWeather(data);
  } catch (err) {
    weatherInfo.innerHTML = `<p style="color: red;">❌ ${err.message}</p>`;
  }
}

// Display weather card
function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  const weatherHTML = `
    <img src="${icon}" alt="Weather Icon" class="weather-icon" />
    <h2>${name}, ${sys.country}</h2>
    <p><strong>🌡️ Temp:</strong> ${main.temp}°C</p>
    <p><strong>🌥️ Condition:</strong> ${weather[0].description}</p>
    <p><strong>💧 Humidity:</strong> ${main.humidity}%</p>
    <p><strong>🌬️ Wind:</strong> ${wind.speed} m/s</p>
  `;

  weatherInfo.innerHTML = weatherHTML;
}
