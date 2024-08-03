<?php

// Retrieve form data
$name = $_POST["name"] ?? '';
$email = $_POST["email"] ?? '';
$subject = $_POST["subject"] ?? '';
$message = $_POST["message"] ?? '';

// Include the PHPMailer library
require "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configure PHPMailer to use SMTP
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host       = 'smtp-mail.outlook.com';  
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->Username   = 'aidan_fleming@hotmail.com';  
    $mail->Password   = 'flemingA1';    
    $mail->SMTPDebug  = true;
    $mail->AuthType = 'OAuth2';

    // Set sender and recipient
    $mail->setFrom('aidan_fleming@hotmail.com', $name);  // Fixed "From" address
    $mail->addReplyTo($email, $name);  // User's email as "Reply-To"
    $mail->addAddress('aidan_fleming@hotmail.com');  // Recipient

    // Set email subject and body
    $mail->Subject = $subject;
    $mail->Body    = $message;

    // Attempt to send the email
    if ($mail->send()) {
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'error' => 'Mailer Error: ' . $mail->ErrorInfo];
    }

} catch (Exception $e) {
    // Log the error message
    error_log("Mailer Error: " . $mail->ErrorInfo, 3, 'phpmailer_error.log');
    $response = ['success' => false, 'error' => 'Exception: ' . $e->getMessage()];
}

// Return the response as a JSON object
header('Content-Type: application/json');
echo json_encode($response);
?>
