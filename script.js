const API_KEY = '5d67ecca30bfa52b4c8fd153e8c94584';

function openTab(event, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let tab of tabContents) {
    tab.style.display = "none";
  }
  const tabButtons = document.getElementsByClassName("tab-btn");
  for (let btn of tabButtons) {
    btn.className = btn.className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}

function updateBackgroundVideo(condition) {
  const video = document.getElementById('backgroundVideo');
  let videoSource = '';

  switch (condition) {
    case 'Clear':
      videoSource = 'videos/clear (2).mp4';
      break;
    case 'Rain':
      videoSource = 'videos/rainy (2).mp4';
      break;
    case 'Clouds':
      videoSource = 'videos/so.mp4';
      break;
    case 'Snow':
      videoSource = 'videos/cloudy.mp4';
      break;
    default:
      videoSource = 'videos/default.mp4';
  }

  video.src = videoSource;
  video.load();
  video.play();
}

function updateLocalTime(timezoneOffset) {
  const localTime = new Date((new Date().getTime()) + (timezoneOffset * 1000));
  const timeString = localTime.toLocaleString(); 
  document.getElementById('localTime').textContent = `Local Time: ${timeString}`;
}

function searchWeather() {
  const city = document.getElementById('cityInput').value;
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const condition = data.weather[0].main;

      document.getElementById('cityName').textContent = data.name;
      document.getElementById('temperature').textContent = `${data.main.temp} °C`;
      document.getElementById('weatherCondition').textContent = data.weather[0].description;
      document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
      document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

  
      const iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById('weatherIcon').src = iconUrl;
      document.getElementById('weatherIcon').alt = data.weather[0].description;

      updateBackgroundVideo(condition);

    
      updateLocalTime(data.timezone);
    })
    .catch(error => console.error('Error fetching weather:', error));

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecast');
      forecastContainer.innerHTML = ''; 

      for (let i = 0; i < data.list.length; i += 8) { 
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' });
        const temp = dayData.main.temp;
        const iconCode = dayData.weather[0].icon;
        const description = dayData.weather[0].description;
        
      
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
          <h4>${date}</h4>
          <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
          <p>${temp} °C</p>
          <p>${description}</p>
        `;
        
        forecastContainer.appendChild(forecastCard);
      }
    })
    .catch(error => console.error('Error fetching forecast:', error));
}
