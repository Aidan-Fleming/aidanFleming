<?php
$countryCode = $_GET['countryCode'];
$data = file_get_contents("https://restcountries.com/v3.1/alpha/$countryCode");

header('Content-Type: application/json; charset=UTF-8');

echo($data);
?>


