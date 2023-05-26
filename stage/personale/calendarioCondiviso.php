<!DOCTYPE html>
<html lang="it">
	<head>
			<?php echo file_get_contents(__DIR__ . '\..\..\www\header.html'); ?>
			<!-- use version 0.19.3 -->
			<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js"></script>
			<script>
			  var today = <?php echo date('d'); ?>;
			  var month = <?php echo date('m'); ?>;
			  var year = <?php echo date('Y'); ?>;
			  var days = <?php $days = cal_days_in_month(CAL_GREGORIAN, date('m'), date('Y')); echo $days;  ?>; //giorni del mese
			  <?php echo file_get_contents('js\calendarioCondiviso.js'); ?>
			  <?php
				// Apriamo il file in lettura
				$handle = fopen("consts/nomiRighe.txt", "r");
				$nomiRighe = array();
				// Verifichiamo se il file è stato aperto correttamente
				{
					$i = 0;
					if ($handle) {
						// Leggiamo il file riga per riga
						while (($line = fgets($handle)) !== false) {
							// Rimuoviamo gli spazi e il newline dalla riga letta
							$line = trim($line);
							// Assegniamo il valore della riga all'elemento corrispondente dell'array JS
							echo "nomiRighe[$i] = '$line';\n";
							array_push($nomiRighe, $line);

							$i++;
						}

						// Chiudiamo il file
						fclose($handle);
					} else {
						// In caso di errore nell'apertura del file
						echo "Impossibile aprire il file nomiRighe.txt!";
					}
					
					$handle = fopen("consts/nomiSostituzioni.txt", "r");
					if ($handle) {
						// Leggiamo il file riga per riga
						while (($line = fgets($handle)) !== false) {
							$line = trim($line);
							echo "nomiRighe[$i] = '$line';\n";
							$i++;
						}
					}else {
						// In caso di errore nell'apertura del file
						echo "Impossibile aprire il file nomiSostituzioni.txt!";
					}
				}
				
				
				?>
			</script>

		
		<style>
		  <?php echo file_get_contents('css\calendarioCondiviso.css'); ?>
		</style>

	</head>
	
	<body onload="start();" style="display: block;position: static;overflow: visible;">
	<?php echo file_get_contents(__DIR__ . '\..\..\www\navbar.html'); ?>
	<main class="page landing-page">
		<center>
		<table id="calendarTable" style="margin-top: 10px;">
			  <thead>
				<tr>
				  <th>01/05/2023 - 31/05/2023</th>
				  <?php for ($i = 1; $i <= $days; $i++) { echo "<th id='th-$i'>$i</th>\n";} ?>
				  <th>%PresUfficio</th>
				  <th>Ferie</th>
				  <th>%PresIndividuale</th>
				</tr>
			  </thead>
			  <tbody>
			  <?php 
					foreach ($nomiRighe as $key => $value) {
						echo "<tr>\n";
						echo "<th>$value</th>\n";
						if (0 == $key) {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td id='scadenze-".$i."'/>";
							}
						}else if (1 == $key) {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td id='presidente-".$i."' class='cella'/>";
							}
						}else if (2 == $key) {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td id='sg-".$i."'/>";
							}
						}else {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td class='cella' id='cella-".($key-2)."-".$i."'></td>\n";
							}
							echo "<td id='presUfficio-".($key-2)."'/>\n";
							echo "<td id='ferie-".($key-2)."'/>\n";
							echo "<td id='percPresInd-".($key-2)."'/>";
						}
						if (3 > $key){
							echo "<td/><td/><td/>";
						}
						echo "</tr>\n";
					}
				?>
				<tr>
				  <th>% pres. Uff. giorn. Tot</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='percentualeUfficio-".$i."'></td>\n";
					}
				   ?>
				  <td/><td/><td/>
			    </tr>
				
				<tr>
				  <th>Sostituzioni</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td/>";
					}
				   ?>
				  <td colspan="3">Legenda</td>
			    </tr>
				  <?php
					$labels = array();
					$trailingLabels = array();
					$classes = array();
					$sostituzioni = array();
					array_push($sostituzioni, "sostituzioniUR.txt");   array_push($labels, "Ufficio Ricorsi");        array_push($trailingLabels, "SW = Smart Working");        array_push($classes, "");
					array_push($sostituzioni, "sostituzioniSeg1.txt"); array_push($labels, "Segreteria Sezione I");   array_push($trailingLabels, "X = Presenza In Ufficio");   array_push($classes, "cella celeste");
					array_push($sostituzioni, "sostituzioniSeg2.txt"); array_push($labels, "Segreteria Sezione II");  array_push($trailingLabels, "F = Ferie");                 array_push($classes, "cella verde");
					array_push($sostituzioni, "sostituzioniURP.txt");  array_push($labels, "URP");                    array_push($trailingLabels, "R = Recupero smart working");array_push($classes, "cella arancione");
					array_push($sostituzioni, "sostituzioniArc.txt");  array_push($labels, "Archivio");               array_push($trailingLabels, "T = Smart working sabato");  array_push($classes, "cella blu");
					array_push($sostituzioni, "sostituzioniPer.txt");  array_push($labels, "Personale");              array_push($trailingLabels, "A = Assenze a vario titolo");array_push($classes, "");
					array_push($sostituzioni, "sostituzioniEco.txt");  array_push($labels, "Economato");              array_push($trailingLabels, "");                          array_push($classes, "");
					array_push($sostituzioni, "sostituzioniPro.txt");  array_push($labels, "Protocollo");             array_push($trailingLabels, "Oggi");                      array_push($classes, "cella-lime-contorno");
					$elemCount = count($labels);
					
					for ($idx = 0; $idx < $elemCount; $idx++) {
						echo "<tr>";
						echo "<th>$labels[$idx]</th>";
						$options = file("consts/".$sostituzioni[$idx]);
						for ($i = 1; $i <= $days; $i++) {
							$nomeDiv = str_replace(' ', '', trim($labels[$idx]));
							$nomeDiv = str_replace('\n', '', trim($nomeDiv));
							echo "<td onmouseover='showDiv(\"div-$nomeDiv-$i\");' onmouseout='hideDiv(\"div-$nomeDiv-$i\");'>";
							echo "<div id='div-$nomeDiv-$i' style='display:none' valore=''>";
							echo "<select id='select-$nomeDiv-$i' style='width: 30px;' onchange='setSelect(this);'>";
							echo "<option/>";
							foreach ($options as $option){
								$trimmedOption = trim($option);
								echo "<option value=\"$trimmedOption\"  valore=\"$trimmedOption\" >$trimmedOption</option>";
							}
							echo "</select>\n";
							echo "</div>";
							echo "</td>\n";
						}
						echo "<td colspan='3' class='$classes[$idx]'>$trailingLabels[$idx]</td>";
						echo "</tr>";
					}
					
				   ?>
				<tr id="comandi" style="display:none">
					<!--td class="senza-bordi" colspan="12">
						<button style="width:100%" onclick="esportaExcel()">Esporta in Excel</button>
					</td-->
					<td class="senza-bordi" colspan="18">
						<button style="width:100%" class="btn btn-secondary" onclick="location.reload();">Annulla</button>
					</td>
					<td class="senza-bordi" colspan="18">
						<button style="width:100%" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Salva</button> <!-- onclick="salva()" -->
					</td>
				</tr>
				
				
			</tbody>
		</table>
		</center>
		</main>
		<?php  echo file_get_contents(__DIR__ . '\..\..\www\footer.html'); ?>
	</body>
	
</html>