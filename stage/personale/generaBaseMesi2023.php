<html>
<head>
	<?php
	
	function data_pasqua($anno) {
				  $a = $anno % 19;
				  $b = (int)($anno / 100);
				  $c = $anno % 100;
				  $d = (int)($b / 4);
				  $e = $b % 4;
				  $f = (int)(($b + 8) / 25);
				  $g = (int)(($b - $f + 1) / 3);
				  $h = (19 * $a + $b - $d - $g + 15) % 30;
				  $i = (int)($c / 4);
				  $k = $c % 4;
				  $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
				  $m = (int)(($a + 11 * $h + 22 * $l) / 451);
				  $mese = (int)(($h + $l - 7 * $m + 114) / 31);
				  $giorno = (($h + $l - 7 * $m + 114) % 31) + 1;
				  return date("Y-m-d", strtotime("$anno-$mese-$giorno"));
				}
	
	
	setlocale(LC_TIME, 'it_IT');
	$numDipendenti = 13;
	$year = 2023;
	$data_pasqua = data_pasqua($year);
	$it_months=["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
	// Definisci le date di tutte le festività dell'anno 2023
	$giorni_festivi = array(
					  $year."-01-01", // Capodanno
					  $year."-01-06", // Epifania
					  $data_pasqua, // Pasqua
					  date("Y-m-d", strtotime("$data_pasqua +1 day")), // Lunedì dell'Angelo
					  $year."-04-25", // Festa della Liberazione
					  $year."-05-01", // Festa dei Lavoratori
					  $year."-06-02", // Festa della Repubblica
					  $year."-08-15", // Assunzione di Maria
					  $year."-11-01", // Tutti i Santi
					  $year."-12-08", // Immacolata Concezione
					  $year."-12-25", // Natale
					  $year."-12-26", // Santo Stefano
					);
					
	$holidays = array_slice($giorni_festivi, 0);
	
	// per rigenererare un solo mese, impostare queste variabili al medesimo valore
	$startMonth = 1;
	$endMonth = 12;
	
	$lavorativi = array(0,0,0,0,0,0,0,0,0,0,0,0);
	
	for ($m = $startMonth; $m <= $endMonth; $m++) {
 
		$month_name = $it_months[$m-1];
		// Calcola il numero di giorni nel mese di un determinato mese
		$num_days = cal_days_in_month(CAL_GREGORIAN, $m, $year);

		

		for ($day = 1; $day <= $num_days; $day++) {
			$date = strtotime("$year-$m-$day");
			$weekday = date('N', $date);
			if ($weekday == 7) { // 7 rappresenta la domenica
				$holidays[] = date('YYYY-mm-dd', $date);
			}
		}
		
		$lav = 0; //calcolo giorni lavorativi del mese
		// Genera gli array con i valori "X", "S" e "D" per ogni giorno del mese 
		for ($i = 0; $i < (3 + $numDipendenti); $i++) {
			$row = array();
			for ($j = 1; $j <= $num_days; $j++) {
				$date = $year.'-'.str_pad($m, 2, "0", STR_PAD_LEFT).'-'.str_pad($j, 2, "0", STR_PAD_LEFT);
				//echo $date.'<br/>';
				if (in_array($date, $holidays)) {
					$row[] = "D";
				} else {
					$weekday = date("N", strtotime($date));
					if ($weekday == 6) {
						$row[] = "S";
					} else if ($weekday <= 5) {
						if ($i > 2){
							$row[] = "X";
						}else {
							if ($i == 0) {
								$lav++;
							}
							$row[] = "";
						}
					} else {
						$row[] = "D";
					}
				}
			}
			$matrix[] = $row;
		}
		
		$lavorativi[$m-1] = $lav;

		// Converti la matrice in JSON e salvala su un file
		$json = json_encode($matrix);
		unset($matrix);
		$result = file_put_contents("data/".$month_name.".json", $json);
	
	?>
	</head>
<body>
	<h6>
	<?php if ($result !== false) {
		echo "Mese di ".$month_name." salvato correttamente, numero di byte scritti: " . $result;
	} else {
		echo "Errore durante il salvataggio del file del mese di ".$month_name;
	}
	}
	
	$json = json_encode($lavorativi);
	$result = file_put_contents("consts/lavorativi2023.json", $json);
	
	?></h6>

</body>
</html>
