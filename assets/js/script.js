var key = config.MY_KEY;

$("#search-button").click(function(){
    var txt_field = $('#input_text').val(); 
    var geo_url = `http://api.openweathermap.org/geo/1.0/direct?q=${txt_field}&limit=5&appid=${key}`;
    var latitude = 0.0;
    var longitude = 0.0;
    var is_city_valid = false;

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
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                  var date = dayjs().format('M/D/YYYY');
                        $('#city-name').text(response.name + " " + date);
                        $('#temp-icon').attr('src', "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
                        $('#city-temp').text("Temp: " + response.main.temp + "\u00B0F");
                        $('#city-wind').text("Wind: " + response.wind.speed + "MPH");
                        $('#city-humidity').text("Humidity: " + response.main.humidity + "%");
                    });

            var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
            fetch(url, {
                method: 'GET', //GET is the default.
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                  console.log(response);
                        for (let index = 1; index < 6; index++) {
                          var calc_index = ((index-1) * 8)-1;
                          if (calc_index < 0) {
                            calc_index = 0;
                          }
                          var date = dayjs(response.list[calc_index].dt_txt.split(" ")[0]).format('M/D/YYYY');
                          $(`#date-${index}`).text(date);
                          $(`#temp-icon-${index}`).attr('src', "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
                          $(`#city-temp-${index}`).text("Temp: " + response.main.temp + "\u00B0F");
                          $(`#city-wind-${index}`).text("Wind: " + response.wind.speed + "MPH");
                          $(`#city-humidity-${index}`).text("Humidity: " + response.main.humidity + "%");
                          
                        }
                    })
        }
        
    })
  }
  );
