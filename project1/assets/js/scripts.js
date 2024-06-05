let myLayer;
let map; 

//get country codes from countryBorders.geo.json
getCountryNamesAndCodes();

//get country codes and names from getCountryCode.json and add to drop down selector
function getCountryNamesAndCodes() {
  $.ajax({
    url: "assets/php/getCountry.php?",
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
      getCountryInfo(countryCode)
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

  

});

//get coordinates using open cage and full country name
function getSelectedCountryCoords(countryName, countryCode){
  $.ajax({
    url: "assets/php/getCountryCoords.php",
    data: {
      countryName:countryName,
    },
    type: "GET",
    success: function (result) {
      console.log("country coordinates")
      console.log(result);

      //make the mai api calls
      //+udating map focus
      updateMapView(result.data.lat, result.data.lng,countryCode)
      console.log(result.data.lat, result.data.lng,countryCode)
      //+get country info
      getTime(result.data.lat, result.data.lng)
      getCountryInfo(countryCode)
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
				console.log(jqXHR)
			}
		}); 

}

// Wiki Modal


// Time Modal
function getTime(lat, lng){
console.log(lat, lng)
  $.ajax({
    url: "assets/php/timezoneJSON.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: lat,
      lng: lng
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.code == "200") {
        console.log(result);
        //linking the results with , appropriate modal IDs in the HTML File
        $('#txtTime').html(result['geonames'][0]['time']);
        $('#txtTimezone').html(result['geonames'][0]['timezoneId']);
      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR)
    }
  }); 

}

//  Weather Modal


// Road Modal










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


