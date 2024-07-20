<?php

// Example use from browser
// Use insertDepartment.php first to create a new dummy record and then specify its id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

// Remove the next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// connection details for MySQL database
$cd_host = "db5016070809.hosting-data.io";
$cd_port = 3306;
$cd_socket = "";

// database name, username and password
$cd_dbname = "dbs13090698";
$cd_username = "dbu5591712";
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

// Prepare and execute a single query to check personnel count and retrieve department name
$query = $conn->prepare('
    SELECT 
        d.name AS departmentName,
        COUNT(p.id) AS personnelCount
    FROM 
        department d
    LEFT JOIN 
        personnel p ON (p.departmentID = d.id)
    WHERE 
        d.id = ?
    GROUP BY 
        d.id
');

$query->bind_param("i", $_POST['id']);
$query->execute();
$result = $query->get_result();
$row = $result->fetch_assoc();

if ($row) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = [$row];
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "location not found";
    $output['data'] = [];
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

mysqli_close($conn);

echo json_encode($output);

?>
