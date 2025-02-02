const apikey = "f485ea0ad30ea30011c7e5b8c5cd8983";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const search = document.querySelector(".search input");
const Btn = document.querySelector(".search button");
const locationBtn = document.querySelector("#location-btn");

// Update Date and Time
function updateDateTime() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const now = new Date();
    document.querySelector(".date-time").innerHTML = now.toLocaleDateString('en-US', options);
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Fetch Weather Data
async function weather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apikey}`);
    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = data.main.temp + "℃";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".Wind").innerHTML = data.wind.speed + "km/h";
    document.querySelector(".weather-description").innerHTML = data.weather[0].description;

    // Sunrise and Sunset
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector(".sunrise").innerHTML = sunriseTime;
    document.querySelector(".sunset").innerHTML = sunsetTime;

    // Change Icon
    switch (data.weather[0].main) {
        case "Clouds": document.querySelector(".icon").src = `icon/clouds.png`; break;
        case "Rain": document.querySelector(".icon").src = `icon/rain.png`; break;
        case "Clear": document.querySelector(".icon").src = `icon/sun.png`; break;
        case "Snow": document.querySelector(".icon").src = `icon/snow.png`; break;
        case "Thunderstorm": document.querySelector(".icon").src = `icon/thunderstorm.png`; break;
        case "Drizzle": document.querySelector(".icon").src = `icon/drizzle.png`; break;
        default: document.querySelector(".icon").src = `icon/sun.png`;
    }

    // Fetch 5-Day Forecast
    fetchForecast(city);
}

// Fetch 5-Day Forecast
async function fetchForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apikey}`);
    const data = await response.json();

    const forecastDays = [];
    const uniqueDates = new Set();

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDates.has(date)) {
            uniqueDates.add(date);
            forecastDays.push(item);
        }
    });

    const forecastContainer = document.querySelector(".forecast-days");
    forecastContainer.innerHTML = "";

    forecastDays.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.innerHTML = `
            <p>${date}</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}">
            <p>${temp}℃</p>
        `;
        forecastContainer.appendChild(dayDiv);
    });
}

// Fetch Weather by Location
async function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector(".city").innerHTML = data.name;
                    document.querySelector(".temp").innerHTML = data.main.temp + "℃";
                    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
                    document.querySelector(".Wind").innerHTML = data.wind.speed + "km/h";
                    document.querySelector(".weather-description").innerHTML = data.weather[0].description;

                    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    document.querySelector(".sunrise").innerHTML = sunriseTime;
                    document.querySelector(".sunset").innerHTML = sunsetTime;

                    switch (data.weather[0].main) {
                        case "Clouds": document.querySelector(".icon").src = `icon/clouds.png`; break;
                        case "Rain": document.querySelector(".icon").src = `icon/rain.png`; break;
                        case "Clear": document.querySelector(".icon").src = `icon/sun.png`; break;
                        case "Snow": document.querySelector(".icon").src = `icon/snow.png`; break;
                        case "Thunderstorm": document.querySelector(".icon").src = `icon/thunderstorm.png`; break;
                        case "Drizzle": document.querySelector(".icon").src = `icon/drizzle.png`; break;
                        default: document.querySelector(".icon").src = `icon/sun.png`;
                    }

                    fetchForecast(data.name);
                });
        }, () => alert("Unable to retrieve your location."));
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Event Listeners
Btn.addEventListener("click", () => weather(search.value));
locationBtn.addEventListener("click", fetchWeatherByLocation);

// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode");
darkModeToggle.addEventListener("change", () => document.body.classList.toggle("dark-mode"));