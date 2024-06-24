<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url = 'https://newsdata.io/api/1/latest?apikey=pub_463194d4060e8b8f48861530839e285c003cc&country=' . $_REQUEST['countryCode'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);
	echo $result; exit();
	$decode = json_decode($result,true);	

	if($decode) {
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
		$output['data'] = $decode['geonames'];
		
		header('Content-Type: application/json; charset=UTF-8');
	
		echo json_encode($output); 
	}
	else {
		$response = new stdClass();
		$response->success = false;
		$response->message = "lmao";

		header('Content-Type: application/json; charset=UTF-8');
	
		echo json_encode($response); 
	}

?>
