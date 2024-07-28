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

// Create a new PHPMailer instance
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

    // Set sender and recipient
    $mail->setFrom($email, $name);
    $mail->addAddress('aidan_fleming@hotmail.com');

    // Set email subject and body
    $mail->Subject = $subject;
    $mail->Body    = $message;

    // Send the email
    $mail->send();

    // Output success message
    echo "Email sent";

} catch (Exception $e) {
    // Log error message to a file
    error_log("Mailer Error: " . $mail->ErrorInfo, 3, 'phpmailer_error.log');

    // Output a user-friendly message
    echo "Sorry, there was a problem sending your email. Please try again later.";
}