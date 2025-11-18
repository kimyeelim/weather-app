// const url =
// 	'https://api.openweathermap.org/data/2.5/weather';
// const apiKey =
// 	'f00c38e0279b7bc85480c3fe775d518c';

// $(document).ready(function () {
// 	weatherFn('Pune');
// });

// async function weatherFn(cName) {
// 	const temp =
// 		`${url}?q=${cName}&appid=${apiKey}&units=metric`;
// 	try {
// 		const res = await fetch(temp);
// 		const data = await res.json();
// 		if (res.ok) {
// 			weatherShowFn(data);
// 		} else {
// 			alert('City not found. Please try again.');
// 		}
// 	} catch (error) {
// 		console.error('Error fetching weather data:', error);
// 	}
// }

// function weatherShowFn(data) {
// 	$('#city-name').text(data.name);
// 	$('#date').text(moment().
// 		format('MMMM Do YYYY, h:mm:ss a'));
// 	$('#temperature').
// 		html(`${data.main.temp}°C`);
// 	$('#description').
// 		text(data.weather[0].description);
// 	$('#wind-speed').
// 		html(`Wind Speed: ${data.wind.speed} m/s`);
// 	$('#weather-icon').attr(
//   	  'src',
//   	  `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
// 	$('#weather-icon').attr('alt', data.weather[0].description);
// 	$('#weather-info').fadeIn();

// }


const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

document.addEventListener('DOMContentLoaded', () => {
  weatherFn('Pune'); // Default city
  const button = document.getElementById('city-input-btn');
  const input = document.getElementById('city-input');

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
