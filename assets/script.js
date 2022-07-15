var previousCities = { city: [] }
var searchHistoryEl = $('.historySection');
var searchHistory = JSON.parse(localStorage.getItem('cities'));

//if there is any local storage data, the history section will display beneath the button:
if (searchHistory) {
    for (var i = 0; i < searchHistory.length; i++) {
        var prevCity = $('<p>').addClass("btn history-button").text(searchHistory[i].city);
        searchHistoryEl.append(prevCity);
    }
}

//the city parameter comes from searchCities click, grabs latitude/longitude, and passes that to fetchWeather:
var weather = {

    // find coordinates
    fetchCoords: function (city) {

        // finds the longitude and latitude coordinates based on city name:
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=96f33839c85744a54cc32451f4cf28cb")

            // parses the data then sets parameter for fetchWeather:
            .then((response) => response.json())
            .then((data) => this.fetchWeather(data));
    },

    // uses coordinates to find the weather for the city, and then passes that data to displayWeather:
    fetchWeather: function (data) {
        document.querySelector(".city-name").innerText = data[0].name + ", " + data[0].state;
        // finds weather data based on the longitude and latitude:
        fetch("https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
            + data[0].lat + "&lon=" + data[0].lon + "&exclude=minutely,hourly&appid=" + "96f33839c85744a54cc32451f4cf28cb")

            // takes all that data, parses, and inserts displayWeather with data the parameters:
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },

    // uses data parameter to find specific endpoints, displays all the data to the screen, including a 5 day forecast:
    displayWeather: function (data) {
        var date = new Date(data.current.dt * 1000).toLocaleString();

        // puts the data on the page:
        $(".current-date").text(date);
        $(".icon").attr('src', "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png");
        $(".description").text(data.current.weather[0].main);
        $(".temp").text("Temperature: " + data.current.temp + "°C");
        $(".wind").text("Wind Speed: " + data.current.wind_speed + "m/s");
        $(".humidity").text("Humidity: " + data.current.humidity + "%");
        $(".UVindex").text("UV index: " + data.current.uvi);
        if (data.current.uvi < "4") {
            $(".UVindex").removeClass("UVindexModerate UVindexHigh").addClass("UVindexLight")
        } if (data.current.uvi > "3") {
            $(".UVindex").removeClass("UVindexLight UVindexHigh").addClass("UVindexModerate")
        } if (data.current.uvi > "6") {
            $(".UVindex").removeClass("UVindexLight UVindexModerate").addClass("UVindexHigh")
        }

        //creates the forecast boxes:
        function forecastBoxes() {
            forecastEl = $(".forecast");
            forecastEl.empty();
        

            for (var i = 1; i < 6; i++) {
                // dissects timestamp to a date that we can read: 
                var date = new Date(data.daily[i].dt * 1000).toLocaleDateString();

                //Boxes For Weather:
                var forecastBoxEl = $("<div>").addClass("column forecast-box");
                var dailyDateEl = $("<h5>").text(date);
                var dailyIconEl = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                var dailyTempEl = $("<h6>").text("temp: " + data.daily[i].temp.day + "°C");
                var dailyHumidityEl = $("<h6>").text("humidity: " + data.daily[i].humidity + "%");
                var dailyWindEl = $("<h6>").text("wind: " + data.daily[i].wind_speed + "m/s");
                forecastBoxEl.append(dailyDateEl, dailyIconEl, dailyTempEl, dailyHumidityEl, dailyWindEl);
                forecastEl.append(forecastBoxEl);
            }
        }
        forecastBoxes();
    }
}; //End of Weather

// Passing Input To fetchCoords:
  function searchCities(event) {
    // sends search-bar value to fetchCoords, checks for search history, than makes new button for city searched:
    if (event.target.matches('.search-button')) {
        // (event.key === "Enter"); {
        //     $("btn search-button").click();
        //   };
        if ($('.search-bar').val() !== "") {
            const city = $('.search-bar').val().trim();
            previousCities.city = city;
            savedCities = JSON.parse(localStorage.getItem('cities'));
            if (!savedCities) {
                savedCities = [];
            }

            //adds search to local storage:
            savedCities.push(previousCities);
            localStorage.setItem('cities', JSON.stringify(savedCities));
            weather.fetchCoords(city);
            var prevCity = $('<p>').addClass("btn history-button").text(city);
            searchHistoryEl.append(prevCity);
        }
    }   

    //if event to click on the previous search options:
    if (event.target.matches('.history-button')) {
        console.log(event.target.innerHTML)
        weather.fetchCoords(event.target.innerHTML);

        
    }
    //Delete Button Event:
    if (event.target.matches('.delete-button')) {
        console.log("clicked")
        localStorage.clear();
        searchHistoryEl.remove('.history-button');
        location.reload();
        (event.key === "Enter"); {
              $("btn delete-button").click();
            };
    }
}//end of searchCities function

  $(".city-search").click(searchCities);