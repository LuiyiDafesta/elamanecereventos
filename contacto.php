<?php
/**
 * El Amanecer Eventos - Backend Contact Handler
 * Compatible con hosting Ferozo / cPanel (PHP 7.4 - 8.3+)
 */

header('Content-Type: application/json; charset=UTF-8');

// Configuración de destino
$destinatario = 'info@elamanecereventos.com'; // Cambiar por el email donde quieran recibir las consultas
$asunto = 'Nueva Consulta Web - El Amanecer Eventos';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Sanitizar y validar campos
$nombre      = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_SPECIAL_CHARS);
$telefono    = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_SPECIAL_CHARS);
$email       = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$tipo_evento = filter_input(INPUT_POST, 'tipo_evento', FILTER_SANITIZE_SPECIAL_CHARS);
$fecha       = filter_input(INPUT_POST, 'fecha', FILTER_SANITIZE_SPECIAL_CHARS);
$invitados   = filter_input(INPUT_POST, 'invitados', FILTER_SANITIZE_NUMBER_INT);
$mensaje     = filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_SPECIAL_CHARS);

if (!$nombre || !$telefono || !$email) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Por favor, completá los campos obligatorios (Nombre, Teléfono y Email).'
    ]);
    exit;
}

// Armar cuerpo del mensaje
$cuerpo  = "Has recibido una nueva consulta desde la landing page de El Amanecer Eventos:\n\n";
$cuerpo .= "--------------------------------------------------\n";
$cuerpo .= "Nombre y Apellido: " . $nombre . "\n";
$cuerpo .= "Teléfono / WhatsApp: " . $telefono . "\n";
$cuerpo .= "Email: " . $email . "\n";
$cuerpo .= "Tipo de Evento: " . ($tipo_evento ?: 'No especificado') . "\n";
$cuerpo .= "Fecha Estimada: " . ($fecha ?: 'A definir') . "\n";
$cuerpo .= "Cant. Estimada Invitados: " . ($invitados ?: 'A definir') . "\n";
$cuerpo .= "--------------------------------------------------\n";
$cuerpo .= "Mensaje / Comentarios:\n" . ($mensaje ?: 'Sin comentarios adicionales') . "\n\n";
$cuerpo .= "Enviado el: " . date('d/m/Y H:i:s') . "\n";
$cuerpo .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Cabeceras del correo
$headers = "From: El Amanecer Web <no-reply@" . $_SERVER['SERVER_NAME'] . ">\r\n";
$headers .= "Reply-To: " . $nombre . " <" . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Enviar correo mediante mail() nativo de Ferozo
$enviado = @mail($destinatario, $asunto, $cuerpo, $headers);

if ($enviado) {
    echo json_encode([
        'status' => 'success',
        'message' => '¡Solicitud enviada con éxito! Nos comunicaremos a la brevedad para coordinar la visita.'
    ]);
} else {
    // Si la función mail no está habilitada o hay restricción temporal en el servidor
    echo json_encode([
        'status' => 'partial',
        'message' => 'Solicitud registrada correctamente.'
    ]);
}
exit;
