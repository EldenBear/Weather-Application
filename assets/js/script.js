var key = config.MY_KEY;

$( document ).ready(function() {
  const previousCities = JSON.parse(localStorage.getItem("cities"));
  if (previousCities !==null) {
    for (let index = 0; index < previousCities.length; index++) {
      const element = previousCities[index];
      var button = $(`<button>${element.city_name}</button>`);
                        button.click(function(){
                          retreiveCurrentWeather(element.latitude, element.longitude);
                          var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${element.latitude}&lon=${element.longitude}&appid=${key}&units=imperial`;
                          fetch(url, {
                            method: 'GET', //GET is the default.
                            })
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (response) {
                                    for (let j = 1; j < 6; j++) {
                                      var calc_index = ((j-1) * 8)-1;
                                      if (calc_index < 0) {
                                        calc_index = 0;
                                      }
                                      var date = dayjs(response.list[calc_index].dt_txt.split(" ")[0]).format('M/D/YYYY');
                                      $(`#date-${j}`).text(date);
                                      $(`#temp-icon-${j}`).attr('src', "https://openweathermap.org/img/wn/" + response.list[calc_index].weather[0].icon + "@2x.png");
                                      $(`#city-temp-${j}`).text("Temp: " + response.list[calc_index].main.temp + "\u00B0F");
                                      $(`#city-wind-${j}`).text("Wind: " + response.list[calc_index].wind.speed + "MPH");
                                      $(`#city-humidity-${j}`).text("Humidity: " + response.list[calc_index].main.humidity + "%");
                                      
                                    }
                                });
                        });
                        $( "#local-search" ).append(button);
    }
    }
});

$("#search-button").click(function(){
    var txt_field = $('#input_text').val(); 
    var geo_url = `http://api.openweathermap.org/geo/1.0/direct?q=${txt_field}&limit=5&appid=${key}`;
    var latitude = 0.0;
    var longitude = 0.0;

fetch(geo_url, {
  method: 'GET', //GET is the default.
})
  .then(function (response) {
    return response.json();
})
.then(function (response) {
        console.log(response);
        if (response.length > 0) {
            latitude = response[0].lat;
            longitude = response[0].lon;
           
            var current_url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
            fetch(current_url, {
                method: 'GET', //GET is the default.
                })
                .then(function (response2) {
                    return response2.json();
                })
                .then(function (response2) {
                  console.log(response2);
                  var date = dayjs().format('M/D/YYYY');
                        $('#city-name').text(response2.name + " " + date);
                        $('#temp-icon').attr('src', "https://openweathermap.org/img/wn/" + response2.weather[0].icon + "@2x.png");
                        $('#city-temp').text("Temp: " + response2.main.temp + "\u00B0F");
                        $('#city-wind').text("Wind: " + response2.wind.speed + "MPH");
                        $('#city-humidity').text("Humidity: " + response2.main.humidity + "%");
                        var button = $(`<button>${response2.name}</button>`);
                        button.click(function(){
                          retreiveCurrentWeather(latitude, longitude);
                          var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
                          fetch(url, {
                            method: 'GET', //GET is the default.
                            })
                            .then(function (response3) {
                                return response3.json();
                            })
                            .then(function (response3) {
                              console.log(response3);
                                    for (let index = 1; index < 6; index++) {
                                      var calc_index = ((index-1) * 8)-1;
                                      if (calc_index < 0) {
                                        calc_index = 0;
                                      }
                                      var date = dayjs(response3.list[calc_index].dt_txt.split(" ")[0]).format('M/D/YYYY');
                                      $(`#date-${index}`).text(date);
                                      $(`#temp-icon-${index}`).attr('src', "https://openweathermap.org/img/wn/" + response3.list[calc_index].weather[0].icon + "@2x.png");
                                      $(`#city-temp-${index}`).text("Temp: " + response3.list[calc_index].main.temp + "\u00B0F");
                                      $(`#city-wind-${index}`).text("Wind: " + response3.list[calc_index].wind.speed + "MPH");
                                      $(`#city-humidity-${index}`).text("Humidity: " + response3.list[calc_index].main.humidity + "%");
                                      
                                    }
                                });
                        });
                        $( "#local-search" ).append(button);
                        addToLocalStorage(latitude, longitude, response2.name);
                    });

            var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
            fetch(url, {
                method: 'GET', //GET is the default.
                })
                .then(function (response2) {
                    return response2.json();
                })
                .then(function (response2) {
                  console.log(response2);
                        for (let index = 1; index < 6; index++) {
                          var calc_index = ((index-1) * 8)-1;
                          if (calc_index < 0) {
                            calc_index = 0;
                          }
                          var date = dayjs(response2.list[calc_index].dt_txt.split(" ")[0]).format('M/D/YYYY');
                          $(`#date-${index}`).text(date);
                          $(`#temp-icon-${index}`).attr('src', "https://openweathermap.org/img/wn/" + response2.list[calc_index].weather[0].icon + "@2x.png");
                          $(`#city-temp-${index}`).text("Temp: " + response2.list[calc_index].main.temp + "\u00B0F");
                          $(`#city-wind-${index}`).text("Wind: " + response2.list[calc_index].wind.speed + "MPH");
                          $(`#city-humidity-${index}`).text("Humidity: " + response2.list[calc_index].main.humidity + "%");
                          
                        }
                    })
        }
        
    })
  }
  );

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