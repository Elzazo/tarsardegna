<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  print_r($_POST);
  $mese = $_POST['mese'];
  $json = $_POST['matrice'];
  $matrix = json_decode($json, true);
  $result = file_put_contents("data/".$mese."_saved.json", $json);
  if ($result === false) {
	echo "Errore durante il salvataggio del file.";
  } else {
	echo "Salvataggio completato con successo.";
  }
}
?>
