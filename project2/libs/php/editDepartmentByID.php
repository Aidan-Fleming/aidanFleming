<?php
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

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Database unavailable";
    echo json_encode($output);
    exit;
}

header('Content-Type: application/json; charset=UTF-8');

if (!isset($_POST['id'], $_POST['name'], $_POST['locationID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Missing parameters";
    echo json_encode($output);
    exit;
}

// Prepare SQL statement to update department
$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
$query->bind_param("sii", $_POST['name'], $_POST['locationID'], $_POST['id']);

$query->execute();

if ($query->affected_rows > 0) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Department updated successfully";
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Department update failed or no changes made";
}

echo json_encode($output);

$query->close();
$conn->close();
?>
