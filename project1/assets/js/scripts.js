let myLayer;
let map;
var currentCityMarkers = null;
var currentMarkers = null;
var rate;
var layersVisible = true;


//get country codes from countryBorders.geo.json
getCountryNamesAndCodes();

//get country codes and names from getCountryCode.json and add to drop down selector
function getCountryNamesAndCodes() {
  $.ajax({
    url: "assets/php/getCountry.php?",
    dataType: 'json',
    type: "GET",
    success: function (countries) {
      let option = "";
      for (let country of countries) {
        option += '<option value="' + country[1] + '">' + country[0] + "</option>";
      }
      $("#countrySelect").append(option);
      
    },
  });
}

getCurrentMapLocation();
//get user's coordinates using geolocation
function getCurrentMapLocation() {
  if (navigator.geolocation) {
    // Geolocation is available in this browser

    // Define a success callback function
    function successCallback(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Do something with the latitude and longitude values
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      //get more information about current location
      getCurrentLocationDetails(latitude, longitude);
      getTime(latitude, longitude);
      getRoad(latitude, longitude);
      getWeather(latitude, longitude);
    }

    // Define an error callback function
    function errorCallback(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.error("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.error("An unknown error occurred.");
          break;
      }
    }

    // Request the user's current location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    // Geolocation is not available in this browser
    console.error("Geolocation is not supported in this browser.");
  }
};
//get country code from from lat lon and intialise map
function getCurrentLocationDetails(latitude, longitude) {
  userLatitude = latitude;
  userLongitude = longitude;

  $.ajax({
    url: "assets/php/getCountryPositionCodeFromLatlon.php",
    dataType: 'json',
    data: {
      lat: userLatitude,
      lng: userLongitude,
      username: "skwembeproff",
    },
    type: "GET",
    success: function (jsonObject) {
      console.log("Current Geo Location :", jsonObject);
      countryCode = jsonObject.countryCode;
      console.log(countryCode);
      countryName = jsonObject.countryName;
      console.log(countryName);
      $("#dropDown").html(countryName);
      getCountryInfo(countryCode)
      getWiki(countryName)
      initializeMap(userLatitude,userLongitude,countryCode);
      showEarthquakes();
    },
  });
};

var earthquakeMarker = L.ExtraMarkers.icon({    
  icon: 'fa-house-crack',     
  markerColor: 'black',
  shape: 'circle',
  prefix: 'fa'
});

var cityMarker = L.ExtraMarkers.icon({
  icon: 'fa-people-group',      
  markerColor: 'yellow',
  shape: 'star',
  prefix: 'fa'          
});



//initialize map , layers and markers 
function initializeMap(userLatitude,userLongitude,countryCode) {
  var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
  );
  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );

  //declare base maps with the tile variables 
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite
  };

  map = L.map("map", {
    layers: [streets]
  }).setView([userLatitude, userLongitude], 6);

  var layerControl = L.control.layers(basemaps).addTo(map);
  myLayer = new L.geoJson().addTo(map);

  // Initialize LayerGroups
  earthquakeLayer = L.layerGroup().addTo(map);
  cityLayer = L.layerGroup().addTo(map);

  // Add border polygon
  getBorder(countryCode, countryName);

  // Add easy buttons
  L.easyButton("fa-info", function (btn, map) {
    $("#infoModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-clock", function (btn, map) {
    $("#timeModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-file-word", function (btn, map) {
    $("#wikiModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-car", function (btn, map) {
    $("#roadModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-cloud-rain", function (btn, map) {
    $("#weatherModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-solid fa-newspaper", function (btn, map) {
    $("#newsModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-dollar-sign", function (btn, map) {
    $("#exchangeModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-location-dot", function(btn, map) {
    if (layersVisible) {
      map.removeLayer(earthquakeLayer);
      map.removeLayer(cityLayer);
    } else {
      map.addLayer(earthquakeLayer);
      map.addLayer(cityLayer);
    }
    layersVisible = !layersVisible;
  }, "Toggle All Layers").addTo(map);

  // Add the LayerGroups to the control layers
  layerControl.addOverlay(earthquakeLayer, "Earthquakes");
  layerControl.addOverlay(cityLayer, "Cities");
}


//handle onchange event
$('#countrySelect').change(function () {

  var countryCode = $(this).val(); // Get the selected value
  console.log('Selected country code: ' + countryCode);
  
  // Use the country code to select the corresponding option and retrieve its text
  var countryName = $("#countrySelect option[value='" + countryCode + "']").text();
  console.log("Selected country name is:", countryName);
  
  
  

  //get coordinates using open cage and full country name
  getSelectedCountryCoords(countryName, countryCode);
  getWiki(countryName)

  

});

//get coordinates using open cage and full country name
function getSelectedCountryCoords(countryName, countryCode){
  console.log (countryName, countryCode)
  $.ajax({    
    url: "assets/php/getCountryCoords.php",
    dataType: 'json',
    data: {
      countryName:countryName,
    },
    type: "GET",
    success: function (result) {
      console.log("country coordinates")
      console.log(result);
      console.log(countryName, countryCode);

      //make the mai api calls
      //+udating map focus
      var Latitude = result.data.lat
      var Longitude = result.data.lng
      updateMapView(Latitude, Longitude,countryCode)
      console.log(Latitude, Longitude,countryCode)
      //+get country info
      getCountryInfo(countryCode)
      getTime(Latitude, Longitude);
      getRoad(Latitude, Longitude);
      getWeather(Latitude, Longitude);
    },
  });

};

// this is where the magic happens, you will need 5 functions like the one below
//e.g getWeatherInfo  , getCurrencyInfo  , getNewsInfo
function getCountryInfo(countryCode){
  //make ajax call to get getcountryInfo.php
		$.ajax({
			url: "assets/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				countryCode: countryCode,
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
          //linking the results with , appropriate modal IDs in the HTML File
					$('#txtContinent').html(result['data'][0]['continentName']);
          $('#txtCountry').html(result['data'][0]['countryName']);
					$('#txtCapital').html(result['data'][0]['capital']);
					$('#txtLanguages').html(result['data'][0]['languages']);
					$('#txtPopulation').html(result['data'][0]['population']);
          $('#txtCurrency').html(result['data'][0]['currencyCode']);

          showExchangeRates(result['data'][0]['currencyCode']);				
				}        
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('Error: ', jqXHR.responseText);
			}
		}); 
    $('.pre-load').addClass("fadeOut");
}

function getWiki(countryName){
    $.ajax({
      url: "assets/php/wikipediaSearchJSON.php",
      type: 'POST',
      dataType: 'json',
      data: {
        search: countryName
      },
      success: function(result) {
        console.log(result);        
        $('#txtSummary').html(result['geonames'][0]['summary']);

        
        const geonames = result.geonames[0];
        console.log(geonames);
        if(geonames.wikipediaUrl) {
          $(`#wiki-page`).html(`<a href=https://${geonames.wikipediaUrl} target="_blank" rel="wikipedia link">Wikipedia Page</a>`);
        }
        else {
          $(`#wiki-page`).html(`N/A`);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error: ', jqXHR.responseText);
      }
    }); 
    $('.pre-load').addClass("fadeOut");
  }

// Time Modal
function getTime(latitude, longitude){
  $.ajax({
    url: "assets/php/timezoneJSON.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: latitude,
      lng: longitude
    },
    success: function(result) {

      console.log(JSON.stringify(result));
            
        console.log(result);
        //linking the results with , appropriate modal IDs in the HTML File
        $('#txtTimezone').html(result['timezoneId']);
        $('#txtTime').html(result['time']);
      
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  }); 
  $('.pre-load').addClass("fadeOut");
}

//  Weather Modal
function getWeather(latitude, longitude) {
    $.ajax({
      url: "assets/php/weatherJSON.php",
      type: 'POST',
      dataType: 'json',
      data: {
        lat: latitude,
        lon: longitude
      },
      success: function(result) {
  
        console.log(JSON.stringify(result));
              
          console.log(result);
          const weather = result.forecast.forecastday[0].day.condition;
          const weather2 = result.forecast.forecastday[1].day.condition;
          const weather3 = result.forecast.forecastday[2].day.condition;
          console.log(weather);
          //linking the results with , appropriate modal IDs in the HTML File
          $('#textWeather').html(result["forecast"]["forecastday"][0]["day"]["condition"]["text"]);          
          $('#textIcon').html(`<img src="${weather.icon}" alt="Weather Icon">`);
          $('#textTemp').html(result["forecast"]["forecastday"][0]["day"]["avgtemp_c"] + "<span>°C</span>");

          $('#textWeather2').html(result["forecast"]["forecastday"][1]["day"]["condition"]["text"]);          
          $('#textIcon2').html(`<img src="${weather2.icon}" alt="Weather Icon">`);
          $('#textTemp2').html(result["forecast"]["forecastday"][1]["day"]["avgtemp_c"] + "<span>°C</span>");

          $('#textWeather3').html(result["forecast"]["forecastday"][2]["day"]["condition"]["text"]);          
          $('#textIcon3').html(`<img src="${weather3.icon}" alt="Weather Icon">`);
          $('#textTemp3').html(result["forecast"]["forecastday"][2]["day"]["avgtemp_c"] + "<span>°C</span>");
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error: ', jqXHR.responseText);
      }
    });
    $('.pre-load').addClass("fadeOut");
  }

// Road Modal
function getRoad(latitude, longitude) {
  $.ajax({
    url: "assets/php/roadJSON.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: latitude,
      lng: longitude
    },
    success: function(result) {

      //console.log(JSON.stringify(result));
            
        //console.log(result);
        //linking the results with , appropriate modal IDs in the HTML File
        $('#txtRoad').html(result["results"][0]["annotations"]["roadinfo"]["drive_on"]);
        $('#txtSpeed').html(result["results"][0]["annotations"]["roadinfo"]["speed_in"]);
      
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  });
  $('.pre-load').addClass("fadeOut");
}

$('#CountryInfoModal').on('hidden.bs.modal', function () {

  $('#pre-load-info').removeClass("fadeOut");
  $('#capital, #currencyCode, #population, #surface, #country-code, #neighbour-coutries, #continent, #curr-code, #wiki-page').html("");
  $('#CountryInfoModal img').attr("src", '');

});

// Function to update map view based on new coordinates
function updateMapView(latitude, longitude,countryCode ) {

  map.setView([latitude, longitude], 6);
    //add border polygon
    getBorder(countryCode);

}


//display border
function getBorder(countryCode) {
 
  $.ajax({
    url: "assets/php/getBorder.php?",
    dataType: 'json',
    type: "GET",
    data: {
      countryCode: countryCode,
    },
    success: function (polygon) {
      
      console.log(polygon);
      // Clear existing layers if needed (optional)
      myLayer.clearLayers();

      // Add the new polygon data and set its style
      myLayer.addData(polygon).setStyle(polyStyle);

      // Fit the map to the bounds of the polygon
      const bounds = myLayer.getBounds();
      map.fitBounds(bounds);

      // Optionally, you can extract the bounding coordinates
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();
      showEarthquakes(north, south, east, west);
      showCities(countryCode);
      showNews(countryCode);      
    }
  });
};

var currentMarkers = null;

function showEarthquakes(north, south, east, west) {
  $.ajax({
    url: "assets/php/earthquakesJSON.php",
    type: 'GET',
    dataType: 'json',
    data: {
      north: north,
      south: south,
      east: east,
      west: west
    },
    success: function(result) {
      if (currentMarkers) {
        map.removeLayer(currentMarkers);
      }

      var markers = L.markerClusterGroup();

      result.earthquakes.forEach(earthquake => {
        var dateTime = earthquake.datetime;
        var mag = earthquake.magnitude;
        var lat = earthquake.lat;
        var lng = earthquake.lng;

        var marker = L.marker([lat, lng], { icon: earthquakeMarker })
          .bindPopup("Datetime: " + dateTime + " & Magnitude: " + mag);
        markers.addLayer(marker);
      });

      earthquakeLayer.clearLayers();
      earthquakeLayer.addLayer(markers);
      currentMarkers = markers;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  });
  $('.pre-load').addClass("fadeOut");
}

function showCities(countryCode) {
  $.ajax({
    url: "assets/php/citiesJSON.php",
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode
    },
    success: function(result) {
      if (currentCityMarkers) {
        map.removeLayer(currentCityMarkers);
      }

      var markers = L.markerClusterGroup();

      const filteredCities = result.geonames.filter(city => city.name !== "United Kingdom" && city.name !== "Great Britain");

      for (let i = 0; i < 10; i++) {
        const city = filteredCities[i];
        var cityName = city.name;
        var popu = city.population;
        var lat = city.lat;
        var lng = city.lng;

        var marker = L.marker([lat, lng], { icon: cityMarker })
          .bindPopup("City: " + cityName + " & Population: " + popu);
        markers.addLayer(marker);
      }

      cityLayer.clearLayers();
      cityLayer.addLayer(markers);
      currentCityMarkers = markers;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  });
  $('.pre-load').addClass("fadeOut");
}

//polygon styling
function polyStyle() {
  return {
    "color": "#40453e",
    "weight": 5,
    "opacity": 1.0,
    "fillColor": "#8a1fbf",
    "fillOpacity": 0.45
  };
}

function showNews(countryCode) {
  $.ajax({
    url: "assets/php/newsJSON.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode
    },
    success: function(result) {

        console.log(JSON.stringify(result));
            
        console.log(result);

        const newsData = result.results[0];
        const newsData2 = result.results[1];
        const newsData3 = result.results[2];
        console.log(newsData); 

        // linking the results with , appropriate modal IDs in the HTML File
        $('#txtTitle').html(result["results"][0]["title"]);
        $('#imageURL').html(`<img src="${newsData.image_url}" alt="News Image" style="width: 100%; height: auto;">`);
        $('#txtDescription').html(result["results"][0]["description"]);
        $(`#txtLink`).html(`<a href=https://${newsData.link} target="_blank" rel="article link">Article</a>`);

        $('#txtTitle2').html(result["results"][1]["title"]);
        $('#imageURL2').html(`<img src="${newsData2.image_url}" alt="News Image" style="width: 100%; height: auto;">`);
        $('#txtDescription2').html(result["results"][1]["description"]);
        $(`#txtLink2`).html(`<a href=https://${newsData2.link} target="_blank" rel="article link">Article</a>`);

        $('#txtTitle3').html(result["results"][2]["title"]);
        $('#imageURL3').html(`<img src="${newsData3.image_url}" alt="News Image" style="width: 100%; height: auto;">`);
        $('#txtDescription3').html(result["results"][2]["description"]);
        $(`#txtLink3`).html(`<a href=https://${newsData3.link} target="_blank" rel="article link">Article</a>`);
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  });
  $('.pre-load').addClass("fadeOut");
}

var rate;

function showExchangeRates(currencyCode) {
  $.ajax({
    url: "assets/php/exchangeRatesJSON.php",
    type: 'POST',
    dataType: 'json',
    data: {
      currencyCode: currencyCode
    },
    success: function(result) {     

      console.log(JSON.stringify(result));
            
        console.log(result);
        //linking the results with , appropriate modal IDs in the HTML File
        $('#countryCurrentTxt').html(currencyCode);
        rate = (result["rates"][currencyCode]);
        $('#otherAmount').val(rate.toFixed(2));

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  });
  $('.pre-load').addClass("fadeOut");
}


usdAmount.addEventListener("input", function() {
  // Get the value of usdAmount
  var x = usdAmount.value;

  // Calculate y as x * rate
  var y = x * rate;

  // Update the value of otherAmount
  otherAmount.value = y.toFixed(2);
});

otherAmount.addEventListener("input", function() {
  // Get the value of usdAmount
  var x = otherAmount.value;

  // Calculate y as x * rate
  var y = x / rate;

  // Update the value of otherAmount
  usdAmount.value = y.toFixed(2);
});


