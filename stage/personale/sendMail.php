<?php

require 'vendor/autoload.php'; // Includi la libreria PHPMailer

const isTo = 0;
const isCc = 1;
const isBcc = 2;


function getLineFromFile($file) {
    $handle = fopen($file, "r");
    // Verifichiamo se il file è stato aperto correttamente
    if ($handle) {
        // Leggiamo il file riga per riga
        while (($line = fgets($handle)) !== false) {
            // Rimuoviamo gli spazi e il newline dalla riga letta
            $line = trim($line);
            return $line;
        }
        // Chiudiamo il file
        fclose($handle);
    }
    return "";
}


function getPwd($mailAddress) {
    return getLineFromFile("consts/pass/email/" . $mailAddress . ".txt");
}

function getAlias($mailAddress) {
    return getLineFromFile("consts/alias/email/" . $mailAddress . ".txt");
}

function setDistributionList($mail, $distributionList, $recipientType = isTo){
	$handle = fopen("consts/address/email/" . $distributionList . ".txt", "r");
	// Verifichiamo se il file è stato aperto correttamente
	if ($handle) {
		// Leggiamo il file riga per riga
		while (($line = fgets($handle)) !== false) {
			// Rimuoviamo gli spazi e il newline dalla riga letta
			$address = trim($line);
			if ($recipientType == isTo) 
				$mail->addAddress($address);
			else if ($recipientType == isCc)
				$mail->AddCc($address);
			else 
				$mail->AddBcc($address);
		}
		// Chiudiamo il file
		fclose($handle);
	}	
}

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
    $mail->SMTPSecure = 'tls'; // Metodo di crittografia (tls o ssl)
    // Configurazione delle credenziali SMTP
    $mittente = $_POST['mittente'];
    $password = getPwd($mittente);
    if ($password == "") {
        echo 'Errore durante l\'invio della mail: Impossibile trovare la password per l\'indirizzo ' . $mittente;
        return;
    }
    $mail->Username = $mittente;
    $mail->Password = $password;
	
	 // Configurazione del mittente e destinatario
    $mail->setFrom($mittente, getAlias($mittente));
    
	if (isset($_POST['distributionListTo'])) {
		setDistributionList($mail, $_POST['distributionListTo']);	
	}else {
		$defaultToAddress = "a.lezza@giustizia-amministrativa.it";
		echo 'Nessuna distrubition list in to specificata, aggiungo l\'indirizzo di default';
		$mail.addAddress($defaultToAddress, $defaultToAddress);
	}
	
	if (isset($_POST['distributionListCc'])) {
		setDistributionList($mail, $_POST['distributionListCc'], isCc);	
	}

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