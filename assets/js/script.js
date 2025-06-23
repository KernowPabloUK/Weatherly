document.addEventListener("DOMContentLoaded", function () {
    //#region Global Variables
    let latestWeatherData = null;
    let geoLocationURL = null;
    const apiKey = "0acafacede1fa597f8b4258fff3abb0d";
    const locationInput = document.querySelector("#locationInput"); 
    const geoLocationButton = document.querySelector('#geoLocationButton');
    const submitButton = document.querySelector("#submit");
    let cardToModalButtons = document.querySelectorAll(".card-to-modal");
    let currentWeatherCard = document.querySelector('#currentWeatherCard');

    const weatherIcons = {
        "01d": "./assets/images/cardImages/sunny.webp",
        "02d": "./assets/images/cardImages/fewClouds.webp",
        "03d": "./assets/images/cardImages/scatteredClouds.webp",
        "04d": "./assets/images/cardImages/brokenClouds.webp",
        "09d": "./assets/images/cardImages/showers.webp",
        "10d": "./assets/images/cardImages/rain.webp",
        "11d": "./assets/images/cardImages/thunderstorm.webp",
        "13d": "./assets/images/cardImages/snow.webp",
        "50d": "./assets/images/cardImages/mist.webp",
        "01n": "./assets/images/cardImages/clearSkyN.webp",
        "02n": "./assets/images/cardImages/fewCloudsN.webp",
        "03n": "./assets/images/cardImages/scatteredCloudsN.webp",
        "04n": "./assets/images/cardImages/brokenCloudsN.webp",
        "09n": "./assets/images/cardImages/showersN.webp",
        "10n": "./assets/images/cardImages/rainN.webp",
        "11n": "./assets/images/cardImages/thunderstorm.webp",
        "13n": "./assets/images/cardImages/snowN.webp",
        "50n": "./assets/images/cardImages/mistN.webp",
    };

    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const windDirections = {
        0: "N",
        10: "N/NE",
        20: "N/NE",
        30: "N/NE",
        40: "NE",
        50: "NE",
        60: "E/NE",
        70: "E/NE",
        80: "E",
        90: "E",
        100: "E",
        110: "E/SE",
        120: "E/SE",
        130: "SE",
        140: "SE",
        150: "S/SE",
        160: "S/SE",
        170: "S",
        180: "S",
        190: "S",
        200: "S/SW",
        210: "S/SW",
        220: "SW",
        230: "SW",
        240: "W/SW",
        250: "W/SW",
        260: "W",
        270: "W",
        280: "W",
        290: "W/NW",
        300: "W/NW",
        310: "NW",
        320: "NW",
        330: "N/NW",
        340: "N/NW",
        350: "N",
        360: "N",
    };
    //#endregion

    //#region  Event Handlers
    geoLocationButton.addEventListener("click", getLocation);
    locationInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitButton.click();
        }
    });
    submitButton.addEventListener("click", async function () {
        await getWeatherForecast();
        await getCurrentWeather();
    });
    cardToModalButtons.forEach(function(button) {button.addEventListener("click", function () {getHourlyWeatherByDay(this);});});
    //#endregion
 
    //#region Functions
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                handleGeoLocation(position);
            }, geoLocationError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }  
    }

    async function handleGeoLocation(position) {
        geoLocationURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`;
        try {
            const response = await fetch(geoLocationURL);
            const data = await response.json();
            if (data && data.length > 0) {
                const city = data[0].name || (data[0].local_names && data[0].local_names.en) || data[0].state || "";
                const country = data[0].country ? `, ${data[0].country}` : "";
                locationInput.value = city + country;
            } else {
                geoLocationError();
            }
        } catch (error) {
            geoLocationError();
        }
    }

    function geoLocationError() {
        alert("Sorry, no position available.");
    }

    async function getCurrentWeather() {
        const url = await getAPIDataURL(apiKey, "current");
        const urlGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${locationInput.value.trim()}&limit=1&appid=${apiKey}`;
        try {
            const responseGeo = await fetch(urlGeo);
            const dataGeo = await responseGeo.json();
            if (dataGeo && dataGeo.length > 0) {
            const city = dataGeo[0].name || "";
            const country = dataGeo[0].country ? `, ${dataGeo[0].country}` : "";
            locationInput.value = city + country;
            }
        } catch (e) {
            // Ignore errors, keep original input
        }
        if (!url) {
            alert("Location not found");
            return;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            currentWeatherCard.classList.add('show');
            document.querySelector("#sub-header-current").classList.add('show');

            if (data.cod == 200) {
                let weatherIconCode = data.weather[0].icon;
                let iconUrl = "";
                for (let icon in weatherIcons) {
                    if (icon === weatherIconCode) {
                        iconUrl = weatherIcons[icon];
                    }
                }
                currentWeatherCard.querySelector(`.weather-icon`).src = iconUrl;

                // Description Section
                let description = data.weather[0].description;
                let firstLetterCapitalised = description[0].toUpperCase();
                let descriptionCapitalised = description.replace(
                    description[0],
                    firstLetterCapitalised
                );
                currentWeatherCard.querySelector(`.description`)
                    .innerHTML = `<strong>${descriptionCapitalised}</strong>`;

                // Metrics Section
                currentWeatherCard.querySelector(`.temp`)
                    .innerHTML = `<strong>${Math.round(data.main.temp)}°C</strong>`;
                
                currentWeatherCard.querySelector(`.sunrise`)
                    .innerHTML = `Sunrise<br /><strong>${convertUnixTimeToDateTime(data.sys.sunrise)}</strong>`;
                currentWeatherCard.querySelector(`.sunset`)
                    .innerHTML = `Sunset<br /><strong>${convertUnixTimeToDateTime(data.sys.sunset)}</strong>`;
                currentWeatherCard.querySelector(`.wind-direction`)
                    .innerHTML = `Wind Direction<br /><strong>${calculateClosestWindDirectionForCurrent(data, windDirections)}</strong>`;
                currentWeatherCard.querySelector(`.wind-speed`)
                    .innerHTML = `Wind Speed<br /><strong>${(data.wind.speed * 2.23694).toFixed(1)} mph</strong>`;
            } else {
                alert("Location not found");;
            }
        } catch (error) {
            alert("Error fetching data");
            console.error(error);
        }
    }

    async function getWeatherForecast() {
        const url = await getAPIDataURL(apiKey);

        try {
            const response = await fetch(url);
            const data = await response.json();
            latestWeatherData = data;
            document.querySelectorAll('.forecast-card').forEach(function(card) {
                card.classList.add('show');
                document.querySelector("#sub-header-forecast").classList.add('show');
            });

            if (data.cod == 200) {
                for (let i = 0; i < 5; i++) {
                    let weatherIconCode = data.list[i * 8].weather[0].icon;
                    let iconUrl = "";
                    for (let icon in weatherIcons) {
                        if (icon === weatherIconCode) {
                            iconUrl = weatherIcons[icon];
                        }
                    }
                    document.querySelector(`#card${i + 1} .weather-icon`)
                        .src = iconUrl;
                    
                    // Date Section
                    document.querySelector(`#card${i + 1} .dayOfTheWeek`)
                        .innerHTML = `${weekdays[new Date(data.list[i * 8].dt_txt).getDay()]} ${new Date(data.list[i * 8].dt_txt).getDate()} ${months[new Date(data.list[0].dt_txt).getMonth()]}`;

                    // Description Section
                    let description = data.list[i].weather[0].description;
                    let firstLetterCapitalised = description[0].toUpperCase();
                    let descriptionCapitalised = description.replace(
                        description[0],
                        firstLetterCapitalised
                    );
                    document.querySelector(`#card${i + 1} .description`)
                        .innerHTML = `<strong>${descriptionCapitalised}</strong>`;

                    // Metrics Section
                    document.querySelector(`#card${i + 1} .temp`)
                        .innerHTML = `<strong>${Math.round(data.list[i * 8].main.temp)}°C</strong>`;
                    
                    document.querySelector(`#card${i + 1} .sunrise`)
                        .innerHTML = `Sunrise<br /><strong>${convertUnixTimeToDateTime(data.city.sunrise)}</strong>`;
                    document.querySelector(`#card${i + 1} .sunset`)
                        .innerHTML = `Sunset<br /><strong>${convertUnixTimeToDateTime(data.city.sunset)}</strong>`;
                    document.querySelector(`#card${i + 1} .wind-direction`)
                        .innerHTML = `Wind Direction<br /><strong>${calculateClosestWindDirection(data,i,windDirections)}</strong>`;
                    document.querySelector(`#card${i + 1} .wind-speed`)
                        .innerHTML = `Wind Speed<br /><strong>${(data.list[i * 8].wind.speed * 2.23694).toFixed(1)} mph</strong>`;
                }
            } else {
                alert("Location not found");;
            }
        } catch (error) {
            alert("Error fetching data");
            console.error(error);
        }
    }

    function getHourlyWeatherByDay(button) {
        const data = latestWeatherData;
        if (!data || data.cod != 200) {
            alert("No weather data available");
            return;
        }

        let dayText = button.closest('.card').querySelector('.dayOfTheWeek').innerText;
        let currentCardDate = convertDateToYYYYMMDD(dayText, months);
        let filteredList = data.list.filter(item => item.dt_txt.startsWith(currentCardDate));
        let modalContent = `
            <div class="modal-header" id="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">${dayText}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">`;
        filteredList.forEach((item, index) => {
            const iconUrl = weatherIcons[item.weather[0].icon] || '';
            modalContent += `
                <div id="modal-card${index + 1}" class="card my-3 m-auto shadow" style="max-width: 540px;">
                    <div class="row g-0">
                        <div class="col-4 text-center align-content-center">
                            <div><img class="weather-icon" src="${iconUrl}" alt="Weather icon"></div>
                        </div>
                        <div class="col-8">
                            <div class="card-body row">
                                <p class="time-of-day card-title"><strong>${item.dt_txt.split(' ')[1].slice(0,5)}</strong></p>
                                <p class="description card-text"><strong>${item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1)}</strong></p>
                                <p class="temp card-text"><strong>${Math.round(item.main.temp)}°C</strong></p>
                                <p class="feels-like card-text">Feels like: <strong>${Math.round(item.main.feels_like)}°C</strong></p>
                                <p class="humidity card-text">Humidity: <strong>${item.main.humidity}%</strong></p>
                                <p class="wind-speed card-text">Wind Speed: <strong>${(item.wind.speed * 2.23694).toFixed(1)} mph</strong></p>
                                <p class="wind-direction card-text">Wind Direction: <strong>${calculateClosestWindDirection({list:[item]},0,windDirections)}</strong></p>
                                <p class="wind-gust-speed card-text">Wind Gust: <strong>${item.wind.gust ? (item.wind.gust * 2.23694).toFixed(1) : 'N/A'} mph</strong></p>
                                <p class="precipitation-percentage card-text">Precipitation: <strong>${item.pop ? Math.round(item.pop * 100) : 0}%</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        modalContent += `</div>`;
        document.querySelector('.modal-content').innerHTML = modalContent;
    }

    async function getAPIDataURL(apiKey, type = "forecast") {
        let url = "";
        const location = locationInput ? locationInput.value.trim() : "";

        if (location !== "") {
            const urlGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}&units=metric`;
            const responseGeo = await fetch(urlGeo);
            const dataGeo = await responseGeo.json();

            if (dataGeo && dataGeo.length > 0) {
                const lat = dataGeo[0].lat;
                const lon = dataGeo[0].lon;
                if (type === "current") {
                    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
                } else {
                    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
                }
            }
        }
        return url;
    }

    function convertUnixTimeToDateTime(unixTime) {
        let date = new Date(unixTime * 1000);
        let hours = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    function calculateClosestWindDirection(data, iteration, windDirections) {
        let windDirectionDegree = data.list[iteration * 8].wind.deg;
        let closestWindDirection = null;
        let minDiff = 360;
        for (let windDegree in windDirections) {
            let diff = Math.abs(windDirectionDegree - Number(windDegree));
            if (diff < minDiff) {
                minDiff = diff;
                closestWindDirection = windDirections[windDegree];
            }
        }
        return closestWindDirection;
    }

    function calculateClosestWindDirectionForCurrent(data, windDirections) {
        let windDirectionDegree = data.wind.deg;
        let closestWindDirection = null;
        let minDiff = 360;
        for (let windDegree in windDirections) {
            let diff = Math.abs(windDirectionDegree - Number(windDegree));
            if (diff < minDiff) {
                minDiff = diff;
                closestWindDirection = windDirections[windDegree];
            }
        }
        return closestWindDirection;
    }

    function convertDateToYYYYMMDD(dayText, months) {
        let [, day, month] = dayText.split(" ");
        let year = new Date().getFullYear();
        let monthIndex = months.findIndex((m) => m === month) + 1;
        let dayPadded = day.toString().padStart(2, "0");
        let monthPadded = monthIndex.toString().padStart(2, "0");
        let currentCardDate = `${year}-${monthPadded}-${dayPadded}`;
        return currentCardDate;
    }
    //#endregion
});



// Placeholder Image// 
document.getElementById("submit").addEventListener("click", function () {
  // Hide the placeholder image
  document.getElementById("forecast-container").style.display = "none";

  // Show the forecast container
  const forecast = document.getElementById("forecast");
  forecast.style.display = "block";
});
