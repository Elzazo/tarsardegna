<?php
if ($_SERVER["REQUEST_METHOD"] == "GET") {
  $mese = $_GET['mese'];
  $json = $_GET['matrice'];
  $matrix = json_decode($json, true);
  $result = file_put_contents("data/".$mese."_saved.json", $json);
  if ($result === false) {
	echo "Errore durante il salvataggio del file.";
  } else {
	echo "Salvataggio completato con successo.";
  }
}
?>
