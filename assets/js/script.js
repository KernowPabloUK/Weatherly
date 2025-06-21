document.addEventListener("DOMContentLoaded", function () {
    //#region Global Variables
    let latestWeatherData = null;
    const apiKey = "0acafacede1fa597f8b4258fff3abb0d";
    const submitButton = document.querySelector("#submit");
    let cardToModalButtons = document.querySelectorAll(".card-to-modal");

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
        10: "N",
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

    //#region Event Handlers
    submitButton.addEventListener("click", getWeather);
    cardToModalButtons.forEach(function(button) {button.addEventListener("click", function () {getHourlyWeatherByDay(this);});
    });

    document.querySelector("body").onload = function() {getLocation()};
    //#

    //#region Functions
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCurrentWeather, geoLocationError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function geoLocationError() {
        alert("Sorry, no position available.");
    }

    async function getCurrentWeather(position) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            currentWeatherData = data;

            // Show the forecast cards when weather data is loaded
            document.querySelector('#card1').classList.add('show');

            console.log(data);

            let weatherIconCode = data.weather[0].icon;
                    let iconUrl = "";
                    for (let icon in weatherIcons) {
                        if (icon === weatherIconCode) {
                            iconUrl = weatherIcons[icon];
                        }
                    }
                    document.querySelector(`#card1 .weather-icon`)
                        .innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;
                    
                    // Date Section
                    // document.querySelector(`#card1 .dayOfTheWeek`)
                    //     .innerHTML = `${weekdays[new Date(data.list[i * 8].dt_txt).getDay()]} ${new Date(data.list[i * 8].dt_txt).getDate()} ${months[new Date(data.list[0].dt_txt).getMonth()]}`;

                    // Description Section
                    let description = data.weather[0].description;
                    let firstLetterCapitalised = description[0].toUpperCase();
                    let descriptionCapitalised = description.replace(
                        description[0],
                        firstLetterCapitalised
                    );
                    document.querySelector(`#card1 .description`)
                        .innerHTML = `<strong>${descriptionCapitalised}</strong>`;

                    // Metrics Section
                    document.querySelector(`#card1 .temp`)
                        .innerHTML = `<strong>${Math.round(data.main.temp)}°C</strong>`;
                    
                    document.querySelector(`#card1 .sunrise`)
                        .innerHTML = `Sunrise<br /><strong>${convertUnixTimeToDateTime(data.sys.sunrise)}</strong>`;
                    document.querySelector(`#card1 .sunset`)
                        .innerHTML = `Sunset<br /><strong>${convertUnixTimeToDateTime(data.sys.sunset)}</strong>`;
                    document.querySelector(`#card1 .wind-direction`)
                        .innerHTML = `Wind Direction<br /><strong>${data.wind.deg}</strong>`;
                    document.querySelector(`#card1 .wind-speed`)
                        .innerHTML = `Wind Speed<br /><strong>${(data.wind.speed * 2.23694).toFixed(1)} mph</strong>`;
        } catch {
            document.querySelector(`.dayOfTheWeek`) //Change to alert?
                .innerHTML = `<p>Error fetching data.</p>`;
        }
    }

    // 5 Day Forecast
    async function getWeather() {
        const url = await getAPIDataURL(apiKey);

        try {
            const response = await fetch(url);
            const data = await response.json();
            latestWeatherData = data;

            console.log(data);

            document.querySelector('#card2').classList.add('show');
            document.querySelector('#card3').classList.add('show');
            document.querySelector('#card4').classList.add('show');
            document.querySelector('#card5').classList.add('show');

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
                        .innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;
                    
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
                document.querySelector(`.dayOfTheWeek`) //Change to alert?
                    .innerHTML = `<p>Location not found.</p>`;
            }
        } catch (error) {
            document.querySelector(`.dayOfTheWeek`) //Change to alert?
                .innerHTML = `<p>Error fetching data.</p>`;
        }
    }

    function getHourlyWeatherByDay(button) {
        const data = latestWeatherData;
        if (!data || data.cod != 200) {
            document.querySelector(`.dayOfTheWeek`).innerHTML = `<p>No weather data available.</p>`; //Change to alert?
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
                            <div class="weather-icon"><img src="${iconUrl}" alt="Weather icon"></div>
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

    async function getAPIDataURL(apiKey) {
        const location = document.querySelector("#locationInput").value;
        const urlGeo = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

        const responseGeo = await fetch(urlGeo);
        const dataGeo = await responseGeo.json();

        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${dataGeo[0].lat}&lon=${dataGeo[0].lon}&appid=${apiKey}&units=metric`;
        return url;
    }

    function convertUnixTimeToDateTime(unixTime) {
        let date = new Date(unixTime * 1000);
        let hours =
            date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
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

    // All code above this line
});

// TODO -------------

//set default location on website load or hide cards until submit is clicked

//for daily weather, ensure average or midday weather is taken to prevent night icons being used for forecasted days (not current day!)

//geo location option

//post code search

//use enter key like a click of submit

//after submit, replace typed location with the found location...eg falmouth => Falmouth, GB ........city.name + , + city.country
