const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

// GeoDB Cities API
const geoapifyKey = '5b624b5177f04631b8a45e18f430ad6e'; //  Geoapify key
const geoapifyBase = 'https://api.geoapify.com/v1/geocode/autocomplete'; //  RapidAPI key

document.addEventListener('DOMContentLoaded', () => {
  weatherFn('Pune'); // Default city

  const button = document.getElementById('city-input-btn');
  const input = document.getElementById('city-input');
  const suggestionsBox = document.getElementById('suggestions');

  // Autocomplete as user types 3+ characters
  input.addEventListener('input', async () => {
    const query = input.value.trim();
    suggestionsBox.innerHTML = '';

    if (!query) {
      suggestionsBox.style.display = 'none';
      return;
    }

    try {
      const url = `${geoapifyBase}?text=${encodeURIComponent(query)}&type=city&limit=5&apiKey=${geoapifyKey}`;
      const res = await fetch(url);
      const json = await res.json();
      const results = json.features;

      if (!results || results.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
      }

      suggestionsBox.style.display = 'block';

      results.forEach((feature) => {
        const cityName = feature.properties.city || feature.properties.name;
        const country = feature.properties.country;
        const div = document.createElement('div');
        div.textContent = `${cityName}, ${country}`;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
          input.value = cityName;
          suggestionsBox.style.display = 'none';
          weatherFn(cityName);
        });
        suggestionsBox.appendChild(div);
      });

    } catch (err) {
      console.error('Geoapify autocomplete error:', err);
      suggestionsBox.style.display = 'none';
    }
  });

  // Button 
  button.addEventListener('click', () => {
    const city = input.value.trim();
    if (city) weatherFn(city);
  });

  // Enter key press
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = input.value.trim();
      if (city) weatherFn(city);
    }
  });
});

async function weatherFn(cName) {
  const tempUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(tempUrl);
    const data = await res.json();
    if (res.ok) {
      weatherShowFn(data);
    } else {
      showError('City not found. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    showError('Network error. Please try again later.');
  }
}

function weatherShowFn(data) {
  document.getElementById('city-name').textContent = data.name;

  // Format current date/time
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
  document.getElementById('date').textContent = formattedDate;

  // Weather details
  document.getElementById('temperature').innerHTML = `${data.main.temp}°C`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('wind-speed').innerHTML = `Wind Speed: ${data.wind.speed} m/s`;

  // Icon
  const icon = document.getElementById('weather-icon');
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.alt = data.weather[0].description;

  // Show the weather info 
  const info = document.getElementById('weather-info');
  info.style.display = 'block';
  info.classList.add('animate__animated', 'animate__fadeIn');
}

function showError(message) {
  const info = document.getElementById('weather-info');
  info.style.display = 'block';
  info.innerHTML = `<p style="color: red;">${message}</p>`;
}

