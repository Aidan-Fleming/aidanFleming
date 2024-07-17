<?php

// example use from browser
// use insertDepartment.php first to create new dummy record and then specify its id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

// remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// connection details for MySQL database
$cd_host = "db5016070809.hosting-data.io";
$cd_port = 3306;
$cd_socket = "";

// database name, username and password
$cd_dbname = "dbs13090698";
$cd_user = 'dbu5591712';
$cd_password = 'Brown2025!';

header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$checkQuery = $conn->prepare('SELECT COUNT(*) AS count FROM personnel WHERE departmentID = ?');
    $checkQuery->bind_param("i", $_REQUEST['id']);
    $checkQuery->execute();
    $checkResult = $checkQuery->get_result();
    $checkRow = $checkResult->fetch_assoc();

    if ($checkRow['count'] > 0) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "Cannot delete department. There are personnel associated with this department.";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
}

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	
	$query->bind_param("i", $_REQUEST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>
