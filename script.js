const apiKey = "e15de19444947941d94f2f5cbf0cb1e1";

// Function to get weather data by user-inputted location
function getWeatherByLocation() {
  const location = document.getElementById("locationInput").value;
  if (location) {
    clearErrorMessage();
    fetchWeatherData(location);
  } else {
    displayErrorMessage("Please enter a location.");
  }
}

// Function to fetch weather data from OpenWeatherMap API
function fetchWeatherData(location) {
  showLoader();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hideLoader();
      displayWeatherData(data);
    })
    .catch((error) => {
      hideLoader();
      console.error("Error fetching weather data:", error);
      displayErrorMessage("Error fetching weather data. Please try again.");
    });
}

// Function to display weather data on the webpage
function displayWeatherData(data) {
  if (data.cod === 200) {
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(2); // Convert m/s to km/h
    const pressure = data.main.pressure;
    const visibility = data.visibility / 1000; // Convert meters to kilometers
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const weatherIcon = getWeatherIcon(data.weather[0].id);

    const weatherHTML = `
      <p><strong>Location:</strong> ${data.name}</p>
      <p><i class="wi ${weatherIcon}"></i> <strong>Weather:</strong> ${weatherDescription}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
      <p><strong>Humidity:</strong> ${humidity}%</p>
      <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
      <p><strong>Pressure:</strong> ${pressure} hPa</p>
      <p><strong>Visibility:</strong> ${visibility} km</p>
      <p><strong>Sunrise:</strong> ${sunrise}</p>
      <p><strong>Sunset:</strong> ${sunset}</p>
    `;

    document.getElementById("weatherData").innerHTML = weatherHTML;
  } else {
    displayErrorMessage("Location not found. Please try again.");
  }
}

function getWeatherIcon(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return "wi-thunderstorm";
  } else if (weatherId >= 300 && weatherId < 500) {
    return "wi-sprinkle";
  } else if (weatherId >= 500 && weatherId < 600) {
    return "wi-rain";
  } else if (weatherId >= 600 && weatherId < 700) {
    return "wi-snow";
  } else if (weatherId >= 700 && weatherId < 800) {
    return "wi-fog";
  } else if (weatherId === 800) {
    return "wi-day-sunny";
  } else if (weatherId === 801) {
    return "wi-day-cloudy";
  } else if (weatherId === 802) {
    return "wi-cloud";
  } else if (weatherId === 803 || weatherId === 804) {
    return "wi-cloudy";
  } else if (weatherId >= 900 && weatherId < 902) {
    return "wi-tornado";
  } else if (weatherId === 902) {
    return "wi-hurricane";
  } else if (weatherId === 903) {
    return "wi-snowflake-cold";
  } else if (weatherId === 904) {
    return "wi-hot";
  } else if (weatherId === 905) {
    return "wi-windy";
  } else if (weatherId === 906) {
    return "wi-hail";
  } else {
    return "wi-na";
  }
}

// Function to get weather data by current location
function getWeatherByCurrentLocation() {
  if (navigator.geolocation) {
    clearErrorMessage();
    showLoader();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherDataByCoords(lat, lon);
      },
      (error) => {
        hideLoader();
        handleGeolocationError(error);
      }
    );
  } else {
    displayErrorMessage("Geolocation is not supported by this browser.");
  }
}

// Function to fetch weather data by coordinates
function fetchWeatherDataByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hideLoader();
      displayWeatherData(data);
    })
    .catch((error) => {
      hideLoader();
      console.error("Error fetching weather data:", error);
      displayErrorMessage("Error fetching weather data. Please try again.");
    });
}

// Function to handle geolocation errors
function handleGeolocationError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      displayErrorMessage("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      displayErrorMessage("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      displayErrorMessage("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      displayErrorMessage("An unknown error occurred.");
      break;
  }
}

// Function to display error messages
function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = message;
}

// Function to clear error messages
function clearErrorMessage() {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = "";
}

// Function to show loader
function showLoader() {
  const loaderHTML = '<div class="loader"></div>';
  document.getElementById("weatherData").innerHTML = loaderHTML;
}

// Function to hide loader
function hideLoader() {
  document.getElementById("weatherData").innerHTML = "";
}
