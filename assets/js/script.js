document.addEventListener("DOMContentLoaded", function () {
    //#region Global Variables
    const apiKey = "0acafacede1fa597f8b4258fff3abb0d";
    const submitButton = document.querySelector("#submit");
  
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
    }
    //#endregion

    //#region Event Handlers
    submitButton.addEventListener("click", getWeather);
    //#endregion

    //#region Functions
    async function getWeather() {
        const location = document.querySelector("#locationInput").value;
        const urlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

        const responseGeo = await fetch(urlGeo);
        const dataGeo = await responseGeo.json();

        const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${dataGeo[0].lat}&lon=${dataGeo[0].lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (data.cod == 200) {
                for (let i = 0; i < 5; i++) {
                    document.querySelector(
                        `#card${i + 1} .dayOfTheWeek`
                    ).innerHTML = `${
                        weekdays[new Date(data.list[i * 8].dt_txt).getDay()]
                    } ${new Date(data.list[i * 8].dt_txt).getDate()} ${
                        months[new Date(data.list[0].dt_txt).getMonth()]
                    }`;
                    document.querySelector(
                        `#card${i + 1} .temp`
                    ).textContent = `${Math.round(
                        data.list[i * 8].main.temp
                    )}°C`;
                    document.querySelector(`#card${i + 1} .sunrise`).innerHTML = `Sunrise<br /><strong>${convertUnixTimeToDateTime(data.city.sunrise)}<strong>`;
                    document.querySelector(`#card${i + 1} .sunset`).innerHTML = `Sunset<br /><strong>${convertUnixTimeToDateTime(data.city.sunset)}<strong>`;
                    document.querySelector(`#card${i + 1} .wind-direction`).innerHTML = `Wind Direction<br /><strong>${calculateClosestWindDirection(data, i, windDirections)}<strong>`;
                    document.querySelector(`#card${i + 1} .wind-speed`).innerHTML = `Wind Speed<br /><strong>${((data.list[i * 8].wind.speed) * 2.23694).toFixed(1)} mph<strong>`;
                } 
              else {
                document.querySelector(
                    `.dayOfTheWeek`
                ).innerHTML = `<p>Location not found.</p>`;
            }
        } catch (error) {
            document.querySelector(
                `.dayOfTheWeek`
            ).innerHTML = `<p>Error fetching data.</p>`;
        }
    }

    function convertUnixTimeToDateTime(unixTime) {
        let date = new Date(unixTime * 1000);
        let hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
        let minutes = date.getMinutes().toString().padStart(2, '0');
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
    //#endregion

    // All code above this line
});