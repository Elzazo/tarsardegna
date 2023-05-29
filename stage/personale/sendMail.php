<?php
require 'vendor/autoload.php'; // Includi la libreria PHPMailer


// Verifica che sia stato inviato il modulo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recupera i valori inviati tramite POST
    $oggetto = $_POST['oggetto'];
    $corpo = $_POST['corpo'];
    // Configurazione del server SMTP
	$mail = new PHPMailer\PHPMailer\PHPMailer();
	$mail->isSMTP();
	$mail->Host = 'smtp.office365.com';  // Indirizzo del server SMTP
	$mail->Port = 587;  // Porta del server SMTP
	$mail->SMTPAuth = true; // Abilita l'autenticazione SMTP
	$mail->Username = 'a.lezza@giustizia-amministrativa.it'; // Nome utente SMTP
	$mail->Password = 'Zazzaz10'; // Password SMTP
	$mail->SMTPSecure = 'tls'; // Metodo di crittografia (tls o ssl)

	// Configurazione del mittente e destinatario
	$mail->setFrom('a.lezza@giustizia-amministrativa.it', 'Aldo Lezza (test webapp)');
	$mail->addAddress('a.lezza@giustizia-amministrativa.it', 'Aldo Lezza (end user)');

	// Configurazione del messaggio
	$mail->Subject = $oggetto;
	$mail->Body = $corpo;
	$mail->isHTML(true);

	// Invio della mail
	if ($mail->send()) {
		echo 'Mail inviata con successo';
	} else {
		echo 'Errore durante l\'invio della mail: ' . $mail->ErrorInfo;
	}

}
?>