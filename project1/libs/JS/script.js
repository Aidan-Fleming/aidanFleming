$(window).on('load', function () {if ($('#preloader').length) {$('#preloader').delay(1000).fadeOut('slow', function () {$(this).remove();});}});

$('#exampleModal').modal("show");

// ---------------------------------------------------------
// GLOBAL DECLARATIONS
// ---------------------------------------------------------

var map;

// tile layers

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

// buttons

var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#exampleModal").modal("show");
});

// ---------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------

// initialise and add controls once DOM is ready

$(document).ready(function () {
  
  map = L.map("map", {
    layers: [streets]
  }).setView([54.5, -4], 6);
  
  // setView is not required in your application as you will be
  // deploying map.fitBounds() on the country border polygon

  layerControl = L.control.layers(basemaps).addTo(map);

  infoBtn.addTo(map);

})


/* OLD AJAX CALLS THAT IM KEEPING FOR REFERENCE FOR LATER

$('#tzBtn').click(function() {
    $.ajax({
        url: "libs/php/timezoneJSON.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#tzLatitude').val(),
            lng: $('#tzLongitude').val()
        },
        success: function(result) {
            console.log(result);

            $('#txtCountry').html(result['countryName']);
                $('#txtTimeZone').html(result['timezoneId']);
                $('#txtTime').html(result['time']);
        
        },
        error: function(jqXHR, textStatus, errorThrown) {            
            console.log(jqXHR)
        }
    }); 

});

$('#wsBtn').click(function() {
    console.log("Click! :)");
       $.ajax({
           url: "libs/php/wikipediaSearchJSON.php",
           type: 'POST',
           dataType: 'json',
           data: {
               q: $('#wsTitle').val(),
               maxRows: $('#wsRows').val()
           },
           success: function(result) {
               console.log(result);
                $('#txtTitle').html(result['geonames'][0]['title']);
                $('#txtSummary').html(result['geonames'][0]['summary']);
                $('#txtURL').html(result['geonames'][0]['wikipediaUrl']);           
           },
           error: function(jqXHR, textStatus, errorThrown) {
               console.log(jqXHR)
           }
       }); 
   
   });

   $('#subBtn').click(function() {
    console.log("Click! :)");
       $.ajax({
           url: "libs/php/countrySubdivisionJSON.php",
           type: 'POST',
           dataType: 'json',
           data: {
               lat: $('#subLatitude').val(),
               lng: $('#subLongitude').val()
           },
           success: function(result) {
               console.log(result);
                $('#txtAdminName').html(result['adminName1']);
                $('#txtCountryName').html(result['countryName']);         
           },
           error: function(jqXHR, textStatus, errorThrown) {
               console.log(jqXHR)
           }
       }); 
   
   }); */