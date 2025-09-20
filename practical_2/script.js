// Hardcoded weather data
const weatherData = {
    "Ahmedabad": "40°C",
    "Mumbai": "32°C",
    "Delhi": "38°C",
    "Bangalore": "28°C",
    "Chennai": "35°C"
};

// Add event listener to the button
document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    const result = document.getElementById('weatherResult');

    if(city === "") {
        result.textContent = "Please enter a city name!";
        return;
    }

    if(weatherData[city]) {
        result.textContent = `The weather in ${city} is ${weatherData[city]}`;
    } else {
        result.textContent = "City not found in our data!";
    }
});
