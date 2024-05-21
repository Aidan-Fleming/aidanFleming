$('#tzBtn').click(function() {
    $.ajax({
        url: "timezoneJSON.php",
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
           url: "wikipediaSearchJSON.php",
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
           url: "countrySubdivisionJSON.php",
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
   
   });