<!DOCTYPE html>
<html lang="it">
	<head>
			<?php echo file_get_contents(__DIR__ . '\..\..\www\header.html'); ?>
			<!-- use version 0.19.3 -->
			<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js"></script>
			<script lang="javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
			<script>
			  <?php
				$month = isset($_GET['month']) ? $_GET['month'] : date('m');
				$year = isset($_GET['year']) ? $_GET['year'] : date('Y');
				$day = isset($_GET['month']) ? ($month == date('m') ? date('d') : -1) : date('d');
			  ?>
			  var today = <?php echo $day; ?>;
			  var month = <?php echo $month; ?>;
			  var year = <?php echo $year; ?>;
			  <?php $days = cal_days_in_month(CAL_GREGORIAN, $month, $year);  ?>; //giorni del mese
			  <?php echo file_get_contents('js\calendarioCondiviso.js'); ?>
			  <?php
				// Apriamo il file in lettura
				$nomiRighe = array();
				$labels = array();
				// Verifichiamo se il file è stato aperto correttamente
				{
					$nomiFile=["intestazioni", "dipendenti", "intestazioniSostituzioni"]; //dipendenti tenuto fino alla migrazione dei nuovi json
					$i = 0; 
					foreach ($nomiFile as &$nomeFile) {
						$handle = fopen("consts/".$nomeFile.".txt", "r");
						if ($handle) {
							// Leggiamo il file riga per riga
							while (($line = fgets($handle)) !== false) {
								// Rimuoviamo gli spazi e il newline dalla riga letta
								$line = trim($line);
								// Assegniamo il valore della riga all'elemento corrispondente dell'array JS
								echo "nomiRighe[$i] = '$line';\n";
								if ($nomeFile == "intestazioniSostituzioni") {
									array_push($labels, $line);
								}else {
									array_push($nomiRighe, $line);
									$i++;
								}
							}

							// Chiudiamo il file
							fclose($handle);
						} else {
							// In caso di errore nell'apertura del file
							echo "Impossibile aprire il file ".nomeFile.".txt!";
						}
					}
				}
				
				
				?>
				
				// impedisce di chiudere la pagina se ci sono dati non salvati
				window.addEventListener('beforeunload', function (e) {
					console.log("beforeunload esecuzione");
					if (isDirty()){
						console.log("beforeunload ci sono dati non salvati, mostriamo l'avviso");
						e.returnValue ="Uscire senza salvare?";
					}
				});
			</script>


		
		<style>
		  <?php echo file_get_contents('css\calendarioCondiviso.css'); ?>
		</style>

	</head>
	
	<body onload="start();" style="display: block;position: static;overflow: visible;">
	<?php echo file_get_contents(__DIR__ . '\..\..\www\navbar.html'); ?>
	<main class="page landing-page">
		<div style="margin-top: 10px; display: flex; justify-content: space-between;">
				<div style="flex: 1"></div>
				<div id="calendarTableDiv" style="flex: 0 0 auto; display: flex; justify-content: center; position: relative">
					<table id="calendarTable"> <!-- margin: 0 auto; -->
					  <thead>
						<tr>
						  <th id="monthThId"/>
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
							$sostituzioni = array();
							$trailingLabels = array();
							$classes = array();
							array_push($sostituzioni, "sostituzioniUR.txt");   array_push($trailingLabels, "SW = Smart Working");        array_push($classes, "");
							array_push($sostituzioni, "sostituzioniSeg1.txt"); array_push($trailingLabels, "X = Presenza In Ufficio");   array_push($classes, "cella celeste");
							array_push($sostituzioni, "sostituzioniSeg2.txt"); array_push($trailingLabels, "F = Ferie");                 array_push($classes, "cella verde");
							array_push($sostituzioni, "sostituzioniURP.txt");  array_push($trailingLabels, "R = Recupero smart working");array_push($classes, "cella arancione");
							array_push($sostituzioni, "sostituzioniArc.txt");  array_push($trailingLabels, "T = Smart working sabato");  array_push($classes, "cella blu");
							array_push($sostituzioni, "sostituzioniPer.txt");  array_push($trailingLabels, "A = Assenze a vario titolo");array_push($classes, "");
							array_push($sostituzioni, "sostituzioniEco.txt");  array_push($trailingLabels, "");                          array_push($classes, "");
							array_push($sostituzioni, "sostituzioniPro.txt");  array_push($trailingLabels, "Oggi");                      array_push($classes, "cella-lime-contorno");
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
							<td class="senza-bordi" id="cancelButton" colspan="18">
								<button style="width:100%" class="btn btn-secondary" onclick="location.reload();">Annulla</button>
							</td>
							<td class="senza-bordi" id="saveButton" colspan="18">
								<button style="width:100%" class="btn btn-primary" data-toggle="modal" data-target="#saveModal">Salva</button>
							</td>
						</tr>
						
						
					</tbody>
				</table>
				</div>
				<div style="flex: 1"></div>
			</div>

		<!-- Modal -->
		<div class="modal fade" id="afterSaveModal" tabindex="-1" role="dialog" aria-labelledby="afterSaveModalTitle" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title" id="afterSaveModal">Invio e-mail</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="showHideModal('afterSaveModal', false);">
				  <span aria-hidden="true">&times;</span>
				</button>
			  </div>
			  <div class="modal-body">
				<p id="afterSaveModalBody"/>
			  </div>
			  <div class="modal-footer">
			    <div class="spinner-border text-primary" role="status" id="afterSaveModalSpinner" style="display:none">
				  <span class="visually-hidden">Loading...</span>
				</div>
				<button type="button" class="btn btn-primary" id="afterSaveModalSaveButton" onclick="sendEmailButtonLogic();">Invia E-mail</button>
				<button type="button" class="btn btn-secondary" id="afterSaveModalCloseButton" onclick="showHideModal('afterSaveModal', false);">Chiudi</button>				
			  </div>
			</div>
		  </div>
		</div>
		
		<!-- Modal -->
		<div class="modal fade" id="okSentEmailModal" tabindex="-1" role="dialog" aria-labelledby="okSentEmailModalTitle" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title" id="okSentEmailModal">Invio e-mail OK</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="showHideModal('okSentEmailModal', false);">
				  <span aria-hidden="true">&times;</span>
				</button>
			  </div>
			  <div class="modal-body">
				<p id="okSentEmailModalBody">E-mail inviata con successo!</p>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-secondary" id="okSentEmailCloseModalButton" onclick="showHideModal('okSentEmailModal', false);">Chiudi</button>				
			  </div>
			</div>
		  </div>
		</div>
		
		
		<!-- Modal -->
		<div class="modal fade" id="errorSentEmailModal" tabindex="-1" role="dialog" aria-labelledby="errorSentEmailModalTitle" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title" id="errorSentEmailModal">Errore e-mail</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="showHideModal('errorSentEmailModal', false);">
				  <span aria-hidden="true">&times;</span>
				</button>
			  </div>
			  <div class="modal-body">
				<p id="errorSentEmailModalBody">E-mail non inviata, errore interno.</p>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-secondary" id="errorSentEmailCloseModalButton" onclick="showHideModal('errorSentEmailModal', false);">Chiudi</button>				
			  </div>
			</div>
		  </div>
		</div>
		
		</main>
		<?php  echo file_get_contents(__DIR__ . '\..\..\www\footer.html'); ?>
	</body>
	
</html>