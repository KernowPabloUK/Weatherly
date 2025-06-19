document.addEventListener("DOMContentLoaded", function () {
    // create array of url weather condition icons
    // key value pair
    const weatherIcons = {
        "01d": "https://openweathermap.org/img/wn/01d@2x.png",
        "02d": "https://openweathermap.org/img/wn/02d@2x.png",
        "03d": "https://openweathermap.org/img/wn/03d@2x.png",
        "04d": "https://openweathermap.org/img/wn/04d@2x.png",
        "09d": "https://openweathermap.org/img/wn/09d@2x.png",
        "10d": "https://openweathermap.org/img/wn/10d@2x.png",
        "11d": "https://openweathermap.org/img/wn/11d@2x.png",
        "13d": "https://openweathermap.org/img/wn/13d@2x.png",
        "50d": "https://openweathermap.org/img/wn/50d@2x.png",
        "01n": "https://openweathermap.org/img/wn/01n@2x.png",
        "02n": "https://openweathermap.org/img/wn/02n@2x.png",
        "03n": "https://openweathermap.org/img/wn/03n@2x.png",
        "04n": "https://openweathermap.org/img/wn/04n@2x.png",
        "09n": "https://openweathermap.org/img/wn/09n@2x.png",
        "10n": "https://openweathermap.org/img/wn/10n@2x.png",
        "11n": "https://openweathermap.org/img/wn/11n@2x.png",
        "13n": "https://openweathermap.org/img/wn/13n@2x.png",
        "50n": "https://openweathermap.org/img/wn/50n@2x.png",
    };

    const apiKey = "0acafacede1fa597f8b4258fff3abb0d";
    const submitButton = document.querySelector("#submit");

    submitButton.addEventListener("click", getWeather);

    async function getWeather() {
        const location = document.querySelector("#locationInput").value;
        const urlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

        const responseGeo = await fetch(urlGeo);
        const dataGeo = await responseGeo.json();

        const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${dataGeo[0].lat}&lon=${dataGeo[0].lon}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (data.cod == 200) {
                for (let i = 0; i < 5; i++) {
                    let weatherIconCode = data.list[0].weather[0].icon;
                    let iconUrl = "";
                    for (let icon in weatherIcons) {
                        if (icon === weatherIconCode) {
                            iconUrl = weatherIcons[icon];
                        }
                    }
                    document.querySelector(
                        `#card${i + 1} .weather-icon`
                    ).innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;

                    document.querySelector(
                        `#card${i + 1} .dayOfTheWeek`
                    ).innerHTML = `${data.list[i * 8].dt_txt}`;
                }
            } else {
                document.querySelector(
                    "#card1 .dayOfTheWeek"
                ).innerHTML = `<p>Location not found.</p>`;
            }
        } catch (error) {
            document.querySelector(
                "#card1 .dayOfTheWeek"
            ).innerHTML = `<p>Error fetching data.</p>`;
        }
    }
    // All code above this line
});

// Location
// <h2>${data.name}, ${data.sys.country}</h2>
// <p>Temperature: ${data.main.temp}°C</p>
//        <p>Weather: ${data.weather[0].description}</p>
//      <p>Humidity: ${data.main.humidity}%</p>
//    <p>Wind Speed: ${data.wind.speed} m/s</p>
