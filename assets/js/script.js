const apiKey = "0acafacede1fa597f8b4258fff3abb0d";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      `;
        } else {
            document.getElementById(
                "weatherResult"
            ).innerHTML = `<p>City not found.</p>`;
        }
    } catch (error) {
        document.getElementById(
            "weatherResult"
        ).innerHTML = `<p>Error fetching data.</p>`;
    }
}
