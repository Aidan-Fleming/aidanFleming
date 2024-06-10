let myLayer;
let map; 

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
      getCountryInfo(countryCode)
      getWiki(countryName)
      initializeMap(userLatitude,userLongitude,countryCode);
    },
  });
};

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

  //initialise map
  map= L.map("map", {
    layers: [streets]
  }).setView([userLatitude, userLongitude], 6);

  //add maps to layers control 
  var layerControl = L.control.layers(basemaps).addTo(map);
  myLayer = new L.geoJson().addTo(map);

  //add border polygon
  getBorder(countryCode);

  //add easy buttons
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
				
				}        
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('Error: ', jqXHR.responseText);
			}
		}); 
    $('.pre-load').addClass("fadeOut");
}

function getWiki(countryName){
  console.log(countryName)
    $.ajax({
      url: "assets/php/wikipediaSearchJSON.php",
      type: 'POST',
      dataType: 'json',
      data: {
        search: countryName
      },
      success: function(result) {
        const geonames = result.geonames[0];
        console.log(geonames);
        if(geonames.wikipediaUrl) {
          $(`#wiki-page`).html(`<a href=https://${geonames.wikipediaUrl} target="_blank" rel="wikipedia link">Wikipedia Page</a>`)
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
  console.log("coords in getWeather are")
  console.log(latitude, longitude)
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
          //linking the results with , appropriate modal IDs in the HTML File
          $('#textWeather').html(result["weather"][0]["main"]);
          $('#textDescription').html(result["weather"][0]["description"]);
          $('#textTemp').html(result["main"]["temp"]);
      
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

      console.log(JSON.stringify(result));
            
        console.log(result);
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
    }
  });
};

//polygon styling
function polyStyle() {
  return {
    "color": "#994444",
    "weight": 5,
    "opacity": 1.0,
    "fillColor": "#fcb6b6",
    "fillOpacity": 0.45
  };
}


