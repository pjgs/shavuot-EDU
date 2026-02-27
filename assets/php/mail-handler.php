<?php
/**
 * Shavuot EDU - Mail Handler
 * Procesa el formulario de contacto con validaciones de seguridad.
 */

header('Content-Type: application/json');

// 1. Configuración
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$to_email = "support@shavuot.com";
$subject_prefix = "[Shavuot EDU Contact] ";

// 2. Solo permitir POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

// 3. Honeypot (Seguridad contra Bots)
// Si este campo está lleno, es un bot.
if (!empty($_POST["website_url_hp"])) {
    echo json_encode(["status" => "success", "message" => "Mensaje procesado (spambot)"]);
    exit;
}

// 4. Obtener y sanitizar datos
$name = filter_var(trim($_POST["name"] ?? ""), FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$subject = filter_var(trim($_POST["subject"] ?? ""), FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_var(trim($_POST["message"] ?? ""), FILTER_SANITIZE_SPECIAL_CHARS);

// 5. Validaciones básicas
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "Por favor, rellena todos los campos obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "El formato del email no es válido."]);
    exit;
}

// 6. Construir el correo
$email_subject = $subject_prefix . (empty($subject) ? "Nuevo mensaje" : $subject);

$email_content = "Has recibido un nuevo mensaje desde el formulario de contacto de Shavuot EDU:\n\n";
$email_content .= "Nombre: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Asunto: " . (empty($subject) ? "No especificado" : $subject) . "\n\n";
$email_content .= "Mensaje:\n$message\n\n";
$email_content .= "--------------------------------------------------\n";
$email_content .= "Enviado desde: " . $_SERVER['HTTP_REFERER'] . "\n";

$headers = "From: no-reply@shavuot.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 7. Enviar
if (mail($to_email, $email_subject, $email_content, $headers)) {
    echo json_encode(["status" => "success", "message" => "¡Mensaje enviado con éxito!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al enviar el correo. Por favor, inténtalo más tarde."]);
}
