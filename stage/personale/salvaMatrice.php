<?php
if ($_SERVER["REQUEST_METHOD"] == "GET") {
  $mese = $_GET['mese'];
  $json = $_GET['matrice'];
  $matrix = json_decode($json, true);
  
  $i = 1;
  $old_version="";
  while (true) {
	  $old_version="data/".$mese."_rev".str_pad($i, 2, "0", STR_PAD_LEFT).".json";
	  if (file_exists($old_version)) {
		  $i++;
	  }else {
		  break;
	  }
  }
  rename("data/".$mese.".json", $old_version);
  $result = file_put_contents("data/".$mese.".json", $json);
  if ($result === false) {
	echo "Errore durante il salvataggio del file.";
  } else {
	echo "Salvataggio completato con successo, versione attuale del file: ".($i+1);
  }
}
?>
