const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
// GeoDB Cities API
const geoapifyKey = '5b624b5177f04631b8a45e18f430ad6e';
const geoapifyBase = 'https://api.geoapify.com/v1/geocode/autocomplete';

document.addEventListener('DOMContentLoaded', () => {
  weatherFn('Pune'); // Default city

  const button = document.getElementById('city-input-btn');
  const input = document.getElementById('city-input');
  const suggestionsBox = document.getElementById('suggestions');

  // Autocomplete
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

  // Search button
  button.addEventListener('click', () => {
    const city = input.value.trim();
    if (city) weatherFn(city);
    suggestionsBox.style.display = 'none';
    weatherFn(city);
  });

  // Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = input.value.trim();
      if (city) weatherFn(city);
      suggestionsBox.style.display = 'none';
      weatherFn(city);
    }
  });
});

// Fetch weather
async function weatherFn(cName) {
  const tempUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
  const forecastTemp = `${forecastUrl}?q=${cName}&appid=${apiKey}&units=metric`;
  try {
    // const res = await fetch(tempUrl);
    // const data = await res.json();
    const [res, forecastRes] = await Promise.all([
      fetch(tempUrl),
      fetch(forecastTemp)
    ]);
    
    const data = await res.json();
    const forecastData = await forecastRes.json();

    if (res.ok) {
      weatherShowFn(data);
      forecastShowFn(forecastData);
    } else {
      showError("City not found. Try again.");
    }
  } catch (error) {
    console.error("Weather fetch error:", error);
    showError("Network error. Try again later.");
  }
}

// Display weather
function weatherShowFn(data) {
  document.getElementById('city-name').textContent = data.name;

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

  document.getElementById('temperature').innerHTML = `${data.main.temp}°C`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

  const icon = document.getElementById('weather-icon');
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById('weather-info').style.display = 'block';

  generateWeatherTips(data);

  // Update background
  updateBackground(data.weather[0].main);
}

// Weather recommendations
function generateWeatherTips(data) {
  const desc = data.weather[0].main.toLowerCase();
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  let tips = [];

  // CONDITION-BASED RECOMMENDATIONS //

  if (desc.includes("rain")) {
    tips.push("🌧 It's rainy — bring an umbrella or raincoat!");
    tips.push("⚠ Roads may be slippery — walk carefully.");
  }

  if (desc.includes("thunder")) {
    tips.push("⛈ Thunderstorm — stay indoors and avoid open areas!");
    tips.push("⚡ Avoid metal objects and tall trees.");
  }

  if (desc.includes("snow")) {
    tips.push("❄ Snowy — wear gloves, thick jackets, and warm boots!");
    tips.push("🚗 Drive slowly — roads may be icy.");
  }

  if (desc.includes("cloud")) {
    tips.push("☁ Cloudy skies — mild and comfortable.");
    tips.push("📸 Soft light — great for taking photos!");
  }

  if (desc.includes("wind")) {
    tips.push("🌬 Windy — secure loose items and avoid light umbrellas.");
    if (wind >= 10) tips.push("💨 Strong wind — hold onto hats or loose clothing.");
  }

  if (
    desc.includes("fog") ||
    desc.includes("mist") ||
    desc.includes("haze") ||
    desc.includes("smoke")
  ) {
    tips.push("🌫 Low visibility — be careful walking or driving!");
    tips.push("😷 Wear a mask if the air feels dusty or smoky.");
  }

  // 🌡 TEMPERATURE-BASED RECOMMENDATIONS  //

  if (temp >= 40) {
    tips.push("🔥 Extremely hot — avoid going outside if possible!");
    tips.push("🥤 Drink water frequently to avoid dehydration.");
    tips.push("🌡 Stay in shade or indoors during peak sunlight.");
  } 
  else if (temp >= 30) {
    tips.push("☀️ Very hot — use sunscreen & sunglasses.");
    tips.push("💧 Stay hydrated — drink plenty of water.");
  } 
  else if (temp >= 20) {
    tips.push("🌤 Warm & pleasant — great weather to go outside!");
    tips.push("🚶‍♂ Perfect for outdoor activities.");
  } 
  else if (temp >= 10) {
    tips.push("🧥 Cool weather — light jacket recommended.");
    tips.push("🍵 Warm drinks can make you feel comfortable.");
  } 
  else if (temp >= 0) {
    tips.push("❄ Very cold — wear warm layers & gloves.");
    tips.push("🔥 Stay warm indoors when possible.");
  } 
  else {
    tips.push("🧊 Freezing — wear thick coats, scarves, gloves!");
    tips.push("⚠ Risk of frostbite — limit time outdoors.");
  }

  // 💧 HUMIDITY-BASED RECOMMENDATIONS  //

  if (humidity >= 80) {
    tips.push("💦 High humidity — you may feel sweaty or sticky.");
    tips.push("🍃 Stay in a well-ventilated place.");
  } 
  else if (humidity <= 30) {
    tips.push("🌵 Dry air — drink water and consider moisturizer.");
  }

  // 🌬 WIND SPEED SPECIAL//

  if (wind >= 15) {
    tips.push("🌪 Strong winds — avoid cycling or motorbikes!");
  }

  //  ✨ FINAL OUTPUT  //

  document.getElementById("weather-tips").innerHTML = tips
    .map(t => `<p>${t}</p>`)
    .join("");
}



// FIXED ERROR WITHOUT DELETING TIPS
function showError(message) {
  document.getElementById("city-name").textContent = "";
  document.getElementById("date").textContent = "";
  document.getElementById("temperature").textContent = "";
  document.getElementById("description").textContent = "";
  document.getElementById("wind-speed").textContent = "";
  document.getElementById("weather-tips").textContent = "";
  
  const info = document.getElementById("weather-info");
  info.style.display = 'block';
  info.innerHTML = `<p style="color:red; font-weight:bold;">${message}</p>`;
}
function forecastShowFn(forecastData) {
    $('#forecast-cards').empty(); // Clear old forecasts

    // Pick one forecast per day (around 12:00)
    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach(day => {
        const date = moment(day.dt_txt).format('ddd, MMM D');
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const temp = `${day.main.temp.toFixed(1)}°C`;
        const desc = day.weather[0].description;
        const wind = day.wind.speed;

        const $card = $(`
    <div class="forecast-card">
        <p><strong>${date}</strong></p>
        <img src="${icon}" alt="${desc}">
        <p>${temp}</p>
        <p>${desc}</p>
    </div>
`);

$card.on("click", () => {
    showForecastPopup({
        date,
        temp,
        desc,
        wind: day.wind.speed,
        humidity: day.main.humidity
    });
});

$('#forecast-cards').append($card);

    });

    $('#forecast').fadeIn();
}

function showForecastPopup(day) {
    const tips = [];

    // Generate tips just like daily weather
    const desc = day.desc.toLowerCase();
    const tempNum = parseFloat(day.temp);
    const wind = day.wind;
    const humidity = day.humidity;

    if (desc.includes("rain")) tips.push("🌧 Bring an umbrella — rainy weather!");
    if (desc.includes("cloud")) tips.push("☁ Cloudy but comfortable.");
    if (desc.includes("clear")) tips.push("☀ Clear skies — perfect for outdoor activities!");
    if (desc.includes("snow")) tips.push("❄ Cold & snowy — wear warm layers!");

    if (tempNum >= 30) tips.push("🥵 Very hot — drink lots of water.");
    else if (tempNum <= 10) tips.push("🧥 Cold — wear a jacket.");

    if (wind >= 10) tips.push("💨 Windy — secure hats and umbrellas!");

    const popup = `
        <div id="popup-overlay">
            <div id="popup-box">
                <h3>${day.date}</h3>
                <p><strong>Temperature:</strong> ${day.temp}</p>
                <p><strong>Description:</strong> ${day.desc}</p>
                <p><strong>Wind Speed:</strong> ${day.wind} m/s</p>
                <p><strong>Humidity:</strong> ${day.humidity}%</p>

                <h4>Recommendations:</h4>
                <div>${tips.map(t => `<p>${t}</p>`).join("")}</div>

                <button id="close-popup">Close</button>
            </div>
        </div>
`;

    $("body").append(popup);

    $("#close-popup").on("click", () => {
        $("#popup-overlay").remove();
    });
}

// WEATHER BACKGROUND DISPLAY
function updateBackground(weatherCondition) {
  const body = document.body;
  const condition = weatherCondition.toLowerCase();

  if (condition.includes("clear")) {
    body.style.backgroundImage = "url('images/sunny.jpg')";
  } else if (condition.includes("rain")) {
    body.style.backgroundImage = "url('images/rainy.jpg')";
  } else if (condition.includes("cloud")) {
    body.style.backgroundImage = "url('images/cloudy.jpg')";
  } else if (condition.includes("snow")) {
    body.style.backgroundImage = "url('images/snowy.jpg')";
  } else {
    body.style.backgroundImage = "url('images/default.jpg')";
  }

  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.transition = "background-image 1s ease-in-out";
}

//CONTACT FORM
document.addEventListener('DOMContentLoaded', function(){
  const form=document.querySelector('.contact-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const formData={
      name:this.name.value,
      email:this.email.value,
      subject:this.subject.value,
      message:this.message.value
    };
    fetch('https://68f9d725ef8b2e621e7da455.mockapi.io/message',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(formData)
    })
    .then(res=>res.json())
    .then(data=>{
      alert('Message sent successfully!');
      console.log('MockAPI response:',data);
      this.reset();
    })
    .catch(err=>{
      console.error('Error:',err);
      alert('Failed to send message.');
    });
  });
});







