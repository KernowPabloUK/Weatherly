document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "0acafacede1fa597f8b4258fff3abb0d";

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

    const submitButton = document.querySelector("#submit");

    submitButton.addEventListener("click", getWeather);

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
            console.log(new Date(data.list[0].dt_txt).getDate());

            if (data.cod == 200) {
                for (let i = 0; i < 5; i++) {
                    document.querySelector(
                        `#card${i + 1} .dayOfTheWeek`
                    ).innerHTML = `${
                        weekdays[new Date(data.list[i * 8].dt_txt).getDay()]
                    } ${new Date(data.list[i * 8].dt_txt).getDate()} ${
                        months[new Date(data.list[0].dt_txt).getMonth()]
                    }`;
                }
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
