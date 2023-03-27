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
            is_city_valid = true;
            console.log(latitude);
            console.log(longitude);
            var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;
            fetch(url, {
                method: 'GET', //GET is the default.
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                        console.log(response);
                        
                    })
        }
        
    })
  }
  );
