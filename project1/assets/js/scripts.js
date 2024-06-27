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
      $("#preloader").fadeOut();
      $("#content").fadeIn();
      
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

      countryCode = jsonObject.countryCode;

      countryName = jsonObject.countryName;

      $("#dropDown").html(countryName);
      getCountryInfo(countryCode)
      getWiki(countryName)
      initializeMap(userLatitude,userLongitude,countryCode);
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
/*
  L.easyButton("fa-clock", function (btn, map) {
    $("#timeModal").modal("show");
  }).addTo(map); */

  L.easyButton("fa-file-word", function (btn, map) {
    $("#wikiModal").modal("show");
  }).addTo(map);
/*
  L.easyButton("fa-car", function (btn, map) {
    $("#roadModal").modal("show");
  }).addTo(map); */

  L.easyButton("fa-cloud-rain", function (btn, map) {
    $("#weatherModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-solid fa-newspaper", function (btn, map) {
    $("#newsModal").modal("show");
  }).addTo(map);

  L.easyButton("fa-solid fa-dollar-sign", function (btn, map) {
    $("#exchangeModal").modal("show");
  }).addTo(map);


  // Add the LayerGroups to the control layers
  layerControl.addOverlay(earthquakeLayer, "Earthquakes");
  layerControl.addOverlay(cityLayer, "Cities");

  const event = new CustomEvent('mapInitialized');
    window.dispatchEvent(event);
}

window.addEventListener('mapInitialized', () => {
  // Your code to show the content goes here.
  document.getElementById('content').style.display = 'block';
});

// Hide the content initially
document.getElementById('content').style.display = 'none';

//handle onchange event
$('#countrySelect').change(function () {

  var countryCode = $(this).val(); // Get the selected value
  
  
  // Use the country code to select the corresponding option and retrieve its text
  var countryName = $("#countrySelect option[value='" + countryCode + "']").text();
  
  
  
  

  //get coordinates using open cage and full country name
  getSelectedCountryCoords(countryName, countryCode);
  getWiki(countryName)

  

});

//get coordinates using open cage and full country name
function getSelectedCountryCoords(countryName, countryCode){
  $.ajax({    
    url: "assets/php/getCountryCoords.php",
    dataType: 'json',
    data: {
      countryName:countryName,
    },
    type: "GET",
    success: function (result) {
      
      //make the mai api calls
      //+udating map focus
      var Latitude = result.data.lat
      var Longitude = result.data.lng
      updateMapView(Latitude, Longitude,countryCode)
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
				if (result.status.name == "ok") {
          //linking the results with , appropriate modal IDs in the HTML File
					$('#txtContinent').html(result['data'][0]['continentName']);
          $('#txtCountry').html(result['data'][0]['countryName']);
					$('#txtCapital').html(result['data'][0]['capital']);
					$('#txtLanguages').html(result['data'][0]['languages']);
          $('#txtPopulation').html(numeral(result['data'][0]['population']).format("0,0"));          
          $('#txtCurrency').html(result['data'][0]['currencyCode']);
          $('#txtISO').html(result['data'][0]['isoAlpha3']);
          $('#txtArea').html(numeral(result['data'][0]['areaInSqKm']).format("0,0"));
          $('#txtCountryCode').html(result['data'][0]['countryCode']);


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
        const geonames = result['query']["pages"]['31717'];
        
        if(geonames.fullurl) {
          $('#wiki-Summ').html(geonames.extract);
          $('#wiki-Summ').on('click', function() {
            window.open(`${geonames.fullurl}`, '_blank');
        });
          } else {
          $('#wiki-Summ').html(`N/A`);
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

        //linking the results with , appropriate modal IDs in the HTML File
        $('#locationTimer').html(result["results"][0]["components"]["city"] + ", " + result["results"][0]["components"]["country"]);
        $('#txtTimezone').html(result["results"][0]["annotations"]["timezone"]["short_name"]);
        $('#txtOffset').html(result["results"][0]["annotations"]["timezone"]["offset_string"]);
        
      
    
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
  

          const weather = result.forecast.forecastday[0].day.condition;
          const weather1 = result.forecast.forecastday[1].day.condition;
          const weather2 = result.forecast.forecastday[2].day.condition;
  
          //linking the results with , appropriate modal IDs in the HTML File
          $('#locationWeather').html(result["location"]["name"] + ", " + result["location"]["country"]);

          $('#textWeather').html(result["forecast"]["forecastday"][0]["day"]["condition"]["text"]);          
          $('#textIcon').html(`<img src="${weather.icon}" alt="Weather Icon">`);
          $('#textMaxTemp').html(Math.round(result["forecast"]["forecastday"][0]["day"]["maxtemp_c"]) + "<span>°C</span>");
          $('#textMinTemp').html(Math.round(result["forecast"]["forecastday"][0]["day"]["mintemp_c"]) + "<span>°C</span>");
          

          $('#textWeather1').html(result["forecast"]["forecastday"][1]["day"]["condition"]["text"]);          
          $('#textIcon1').html(`<img src="${weather1.icon}" alt="Weather Icon">`);
          $('#textMaxTemp1').html(Math.round(result["forecast"]["forecastday"][0]["day"]["maxtemp_c"]) + "<span>°C</span>");
          $('#textMinTemp1').html(Math.round(result["forecast"]["forecastday"][0]["day"]["mintemp_c"]) + "<span>°C</span>");

          var dateStr = result["forecast"]["forecastday"][1]["date"];
          
          var formattedDate = Date.parse(dateStr).toString("ddd dS");
          
          $('#tomorrow').html(formattedDate);

          $('#textWeather2').html(result["forecast"]["forecastday"][2]["day"]["condition"]["text"]);          
          $('#textIcon2').html(`<img src="${weather2.icon}" alt="Weather Icon">`);
          $('#textMaxTemp2').html(Math.round(result["forecast"]["forecastday"][0]["day"]["maxtemp_c"]) + "<span>°C</span>");
          $('#textMinTemp2').html(Math.round(result["forecast"]["forecastday"][0]["day"]["mintemp_c"]) + "<span>°C</span>");

          
          var dateStr1 = result["forecast"]["forecastday"][2]["date"];
          
          var formattedDate1 = Date.parse(dateStr1).toString("ddd dS");
          
          $('#dayAfter').html(formattedDate1);

          var update = (result["current"]["last_updated"]);
          var updateDate = Date.parse(update).toString("HH:mm, dS MMM");
          $('#lastUpdated').html(updateDate);
      
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

      var markers = L.markerClusterGroup({
        polygonOptions: {
          fillColor: "#efc240",
          color: "#000",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5
        }
      });

      result.earthquakes.forEach(earthquake => {
        var dateTime = new Date(earthquake.datetime);
        var strDate = dateTime.toString('dddd d MMMM yyyy');
        var parts = strDate.split(' ');
        var formattedDate = parts.slice(0, 4).join(' ');
        
        var mag = earthquake.magnitude;
        var lat = earthquake.lat;
        var lng = earthquake.lng;

        var marker = L.marker([lat, lng], { icon: earthquakeMarker })
          //.bindPopup("Datetime: " + formattedDate + " & Magnitude: " + mag)
          .bindTooltip("An earthquake happened here at " + formattedDate +" at the Magnitude of " + mag, { direction: "top", sticky: true });
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

      var markers = L.markerClusterGroup({
        polygonOptions: {
          fillColor: "#efc240",
          color: "#000",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5
        }
      });

      const filteredCities = result.geonames.filter(city => city.name !== "United Kingdom" && city.name !== "Great Britain");

      for (let i = 0; i < 10; i++) {
        const city = filteredCities[i];
        var cityName = city.name;
        var popu = city.population;
        var lat = city.lat;
        var lng = city.lng;

        var marker = L.marker([lat, lng], { icon: cityMarker })          
          .bindTooltip(("City: " + cityName + " & Population: " + (numeral(popu).format("0,0"))), { direction: "top", sticky: true });  // Add this line for tooltip
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
    "weight": 1,
    "opacity": 1.0,
    "dashArray": "10, 10",
    "fillColor": "#8a1fbf",
    "fillOpacity": 0.15
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
      if (!result || !Array.isArray(result.results)) {
        console.error('Unexpected response format:', result);
        return;
      }

      const articles = result.results.slice(0, 3); // Get the first 3 articles
      let newsTablesHTML = '';
      for (let i = 0; i < articles.length; i++) {
        newsTablesHTML += generateNewsTable(i + 1);
      }
      $('#newsTables').html(newsTablesHTML);

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const placeholder = 'placeholderimage.jpg';        
        const imageUrl = validateImageUrl(article.image_url) ? article.image_url : 'placeholderimage.jpg';
        $('#imageURL' + (i + 1)).html(`<img src="${imageUrl}" alt="News Image" style="max-width: 100%; height: auto;">`);
        $('#txtDescription' + (i + 1)).html(article.title);
        $('#txtDescription' + (i + 1)).click(function() {
          window.open(`${article.link}`, '_blank');
        });       
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error: ', jqXHR.responseText);
    }
  });
  $('.pre-load').addClass("fadeOut");
}

function generateNewsTable(index) {
  return `
    <table class="table table-borderless">   
      <tr>
        <td rowspan="2" width="50%" id="imageURL${index}">
          <!-- Content for imageURL${index} -->
        </td>            
        <td id="txtDescription${index}">  
          <!-- Content for txtDescription${index} -->
        </td>            
      </tr>
      <tr>                       
        <td class="align-bottom pb-0">              
          <img class="fw-light fs-6 mb-1" id="source${index}"></img>              
        </td>           
      </tr>          
    </table>
    <hr>
  `;
}

function validateImageUrl(url) {
  const isValid = url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'));
  return isValid;
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
        //linking the results with , appropriate modal IDs in the HTML File
        $('#countryCurrentTxt').html("To " + currencyCode);
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


