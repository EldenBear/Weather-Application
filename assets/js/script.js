var key = config.MY_KEY;

// load local storage when the page loads
$( document ).ready(function() {
  const previousCities = JSON.parse(localStorage.getItem("cities"));
  if (previousCities !== null) {
    // for each previous city in local storage, create a button for it and append it to the "local-search" div
    for (let index = 0; index < previousCities.length; index++) {
      const element = previousCities[index];
      var button = $(`<button class="stored-cities">${element.city_name}</button>`);
      button.click(function() {
        retreiveCurrentWeather(element.latitude, element.longitude);
        var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${element.latitude}&lon=${element.longitude}&appid=${key}&units=imperial`;
        fetch(url, {
          method: 'GET',
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          for (let j = 1; j < 6; j++) {
            var date = dayjs().add(j, 'day');
            var dateString = date.format('YYYY-MM-DD');
            var matchingDates = response.list.filter(x=>
              x.dt_txt.includes(dateString)
            );
            var matchingDate = matchingDates[0];
            var date = dayjs(matchingDate.dt_txt.split(" ")[0]).format('M/D/YYYY');
            $(`#date-${j}`).text(date);
            $(`#temp-icon-${j}`).attr('src', "https://openweathermap.org/img/wn/" + matchingDate.weather[0].icon + "@2x.png");
            $(`#city-temp-${j}`).text("Temp: " + matchingDate.main.temp + "\u00B0F");
            $(`#city-wind-${j}`).text("Wind: " + matchingDate.wind.speed + "MPH");
            $(`#city-humidity-${j}`).text("Humidity: " + matchingDate.main.humidity + "%"); 
          }
        });
      });
      
      // append the newly created button
      $( "#local-search" ).append(button);
    }
    }
});

// click functionality for the search button
$("#search-button").click(function(){
  // get user input
  var txt_field = $('#input_text').val(); 
  
  // URL to get the latitude and longitude 
  var geo_url = `http://api.openweathermap.org/geo/1.0/direct?q=${txt_field}&limit=5&appid=${key}`;
  var latitude = 0.0;
  var longitude = 0.0;

  fetch(geo_url, {
    method: 'GET',
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    // if we get a valid response, take the latitude and longitude from the first city listed
    if (response.length > 0) {
      latitude = response[0].lat;
      longitude = response[0].lon;
      
      // fetch data for the current day's weather
      var current_url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
      fetch(current_url, {
        method: 'GET',
      })
      .then(function (response2) {
        return response2.json();
      })
      .then(function (response2) {
        // display the current weather for the city
        var date = dayjs().format('M/D/YYYY');
        $('#city-name').text(response2.name + " " + date);
        $('#temp-icon').attr('src', "https://openweathermap.org/img/wn/" + response2.weather[0].icon + "@2x.png");
        $('#city-temp').text("Temp: " + response2.main.temp + "\u00B0F");
        $('#city-wind').text("Wind: " + response2.wind.speed + "MPH");
        $('#city-humidity').text("Humidity: " + response2.main.humidity + "%");
        
        // add new button to the city search history
        var button = $(`<button class="stored-cities">${response2.name}</button>`);
        button.click(function(){
          retreiveCurrentWeather(latitude, longitude);
          var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
          fetch(url, {
            method: 'GET',
          })
          .then(function (response3) {
            return response3.json();
          })
          .then(function (response3) {
            for (let index = 1; index < 6; index++) {
              var date = dayjs().add(index, 'day');
              var dateString = date.format('YYYY-MM-DD');
              var matchingDates = response2.list.filter(x=>
                x.dt_txt.includes(dateString)
              );
              var matchingDate = matchingDates[0];
              var date = dayjs(matchingDate.dt_txt.split(" ")[0]).format('M/D/YYYY');
              $(`#date-${index}`).text(date);
              $(`#temp-icon-${index}`).attr('src', "https://openweathermap.org/img/wn/" + matchingDate.weather[0].icon + "@2x.png");
              $(`#city-temp-${index}`).text("Temp: " + matchingDate.main.temp + "\u00B0F");
              $(`#city-wind-${index}`).text("Wind: " + matchingDate.wind.speed + "MPH");
              $(`#city-humidity-${index}`).text("Humidity: " + matchingDate.main.humidity + "%");
            }
          });
        });
        $( "#local-search" ).append(button);

        // write search history to local storage
        addToLocalStorage(latitude, longitude, response2.name);
      });

      // fetch data for the weather over the next 5 days
      var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
      fetch(url, {
        method: 'GET',
      })
      .then(function (response2) {
        return response2.json();
      })
      .then(function (response2) {
        // display the weather for the next 5 days
        for (let index = 1; index < 6; index++) {
          var date = dayjs().add(index, 'day');
          var dateString = date.format('YYYY-MM-DD');
          var matchingDates = response2.list.filter(x=>
            x.dt_txt.includes(dateString)
          );
          var matchingDate = matchingDates[0];
          var date = dayjs(matchingDate.dt_txt.split(" ")[0]).format('M/D/YYYY');
          $(`#date-${index}`).text(date);
          $(`#temp-icon-${index}`).attr('src', "https://openweathermap.org/img/wn/" + matchingDate.weather[0].icon + "@2x.png");
          $(`#city-temp-${index}`).text("Temp: " + matchingDate.main.temp + "\u00B0F");
          $(`#city-wind-${index}`).text("Wind: " + matchingDate.wind.speed + "MPH");
          $(`#city-humidity-${index}`).text("Humidity: " + matchingDate.main.humidity + "%");
        }
      });
    }
  })
});

// retrieve the current weather at the location
function retreiveCurrentWeather(latitude, longitude) {
  // URL for current weather
  var current_url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
  fetch(current_url, {
    method: 'GET',
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    var date = dayjs().format('M/D/YYYY');
    
    // Set front end to show current weather data
    $('#city-name').text(response.name + " " + date);
    $('#temp-icon').attr('src', "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
    $('#city-temp').text("Temp: " + response.main.temp + "\u00B0F");
    $('#city-wind').text("Wind: " + response.wind.speed + "MPH");
    $('#city-humidity').text("Humidity: " + response.main.humidity + "%");
  });
};

// add a city to local storage
function addToLocalStorage(latitude, longitude, city_name) {
  // format city data into an object
  var cityData = {
    latitude: latitude,
    longitude: longitude,
    city_name: city_name
  };
  var cities = [cityData];

  // get previous city data and append the new data to it if the previous data exists
  const previousCities = JSON.parse(localStorage.getItem("cities"));
  var combinedCities = [];
  if (previousCities !==null) {
    combinedCities = previousCities.concat(cities);
  }else{
    combinedCities = cities;
  }
  
  // set the city data in the local storage
  localStorage.setItem("cities", JSON.stringify(combinedCities));
}