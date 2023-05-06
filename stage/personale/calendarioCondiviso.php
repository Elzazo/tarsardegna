<html>
	<head>
			<script>
			  var matrice = [];
			  var month = <?php echo date('m'); ?>;
			  var year = <?php echo date('Y'); ?>;
			  var days = <?php $days = cal_days_in_month(CAL_GREGORIAN, date('m'), date('Y')); echo $days;  ?>; //giorni del mese
			  var numDipendenti = 13;
			  var numRows = numDipendenti + 3;
			  var lavorativi = 0;
			  			
			  function aggiornaMatriceAttuale(id) {
				var idx = 0; var day = id.split("-")[1]; 
				if (id.indexOf("presidente")!== -1) {
					console.log("Presidente da aggiornare");
					idx = 1;
				}else if (id.indexOf("cella")!== -1) {
					var subStrings = id.split("-");
					idx = parseInt(subStrings[1]) + 2;
					day = subStrings[2];
				}
				
				//console.log("id: "+id+", idx="+idx+", day="+day);
				//console.log(matriceAttuale);
				if (id.indexOf("scadenze")!== -1){
					matriceAttuale[idx][day]=document.getElementById(id).innerHTML;
				}else {
					//console.log(id);
					//console.log("valore da impostare:"+document.getElementById(id).getAttribute("valore"));
					//console.log("valore da attuale:"+matriceAttuale[idx][day]);
					matriceAttuale[idx][day]=document.getElementById(id).getAttribute("valore");
				}
				
				document.getElementById("comandi").style.display = (confrontaMatrici(matrice, matriceAttuale).length > 0)  ?  "table-row" : "none";
			  }
			
			
			  function calcolaPercentualeUfficioIniziale(){
				for (var i = 1; i<=days; i++) {
					calcolaPercentualeUfficio(i);
				}
			  }
			
			  function calcolaPercentualeUfficio(day){
				{
					var presenze = 0;
					for (var i=1; i<=numDipendenti; i++){
						var cellName = "cella-"+i+"-"+day;
						//console.log("cellname is "+cellName);
						if (document.getElementById(cellName).getAttribute("valore") == 'X'){
							presenze++;
						}
					}
					var percentage = presenze / numDipendenti;
					var cellName = "percentualeUfficio-"+day;
					//console.log("cellname is "+cellName);
					document.getElementById(cellName).innerHTML = percentage.toFixed(2);
				}
				
				for (var i = 1; i <=numDipendenti; i++) {
					var pres = 0, ferie = 0, percentage = 0;
					for (var j=1; j<=days; j++){
						var cellName = "cella-"+i+"-"+j;
						if (document.getElementById(cellName).getAttribute("valore") == 'X'){
							pres++;
						}else if (document.getElementById(cellName).getAttribute("valore") == 'F'){
							ferie++;
						}
					document.getElementById("presUfficio-"+i).innerHTML = pres;
					document.getElementById("ferie-"+i).innerHTML = ferie;
					document.getElementById("percPresInd-"+i).innerHTML = (pres / lavorativi).toFixed(2);
					}
				}
			  }
			  
			  function impostaClasse(cella, nuovoValore){
				    cella.classList.remove("celeste", "bianco", "verde", "gialla", "rossa", "arancione");
					if (nuovoValore === "X" || nuovoValore === "T") {
					  cella.classList.add("celeste");
					} else if (nuovoValore === "A" || nuovoValore === "SW") {
					  cella.classList.add("bianco");
					} else if (nuovoValore === "F") {
					  cella.classList.add("verde");
					}else if (nuovoValore === "R") {
					  cella.classList.add("arancione");
					}else if (nuovoValore === "D") {
					  cella.classList.add("rossa");
					}else if (nuovoValore === "S") {
					  cella.classList.add("gialla");
					}
			  }
			
			  function cambiaValore(cella) {
					var valoreAttuale = cella.getAttribute("valore");
					var nuoviValori = ["A", "SW", "F", "X", "R"];
					var nuovoValore = nuoviValori[(nuoviValori.indexOf(valoreAttuale) + 1) % nuoviValori.length];
					cella.setAttribute("valore", nuovoValore);
					cella.innerHTML = nuovoValore;
					
					// Rimuovi le classi precedenti e aggiungi la nuova classe in base al valore
					cella.classList.remove("celeste", "bianco", "verde", "gialla", "rossa", "arancione");
					if (nuovoValore === "X" || nuovoValore === "T") {
					  cella.classList.add("celeste");
					} else if (nuovoValore === "A" || nuovoValore === "SW") {
					  cella.classList.add("bianco");
					} else if (nuovoValore === "F") {
					  cella.classList.add("verde");
					}else if (nuovoValore === "R") {
					  cella.classList.add("arancione");
					}
					
					var id = cella.getAttribute("id");
					// aggiorno le percentuali solo se cambia un dipendente
					var subStrings = cella.getAttribute("id").split("-");
					var lastSubstring = subStrings[subStrings.length - 1];
					calcolaPercentualeUfficio(lastSubstring);
					aggiornaMatriceAttuale(id);
				 }
				 
			 function turnoDelSabato(cella) {
				var valoreAttuale = cella.getAttribute("valore");
				if (valoreAttuale === "S") {
				  cella.setAttribute("valore", "T");
				  cella.innerHTML = "T";
				  cella.classList.remove("gialla");
				  cella.classList.add("blu");
				} else if (valoreAttuale === "T") {
				  cella.setAttribute("valore", "S");
				  cella.innerHTML = "";
				  cella.classList.remove("blu");
				  cella.classList.add("gialla");
				}
				aggiornaMatriceAttuale(id);
			  }
			  
			  function presidenteInSede(cella) {
				var valoreAttuale = cella.getAttribute("valore");
				if (valoreAttuale === "P") {
				  cella.setAttribute("valore", "A");
				  cella.classList.remove("giallina");
				} else if (valoreAttuale === "A") {
				  cella.setAttribute("valore", "P");
				  cella.classList.add("giallina");
				}
				aggiornaMatriceAttuale(cella.getAttribute("id"));
			  }
			  
			  
			  var nomiRighe = [];
			  <?php
				// Apriamo il file in lettura
				$handle = fopen("consts/nomiRighe.txt", "r");
				$nomiRighe = array();
				// Verifichiamo se il file è stato aperto correttamente
				if ($handle) {
					$i = 0;
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
					echo "Impossibile aprire il file!";
				}
				?>
			  
			  var frasi = []
			  frasi["X"]="sarà presente in ufficio";
			  frasi["P"]="sarà presente in sede";
			  frasi["A"]="sarà assente";
			  frasi["T"]="sarà in turno sabato";
			  frasi["F"]="sarà in ferie";
			  frasi["SW"]="sarà in smart working";
			  frasi["R"]="sarà in recupero turno del sabato";
			  
			  function confrontaMatrici(matrice1, matrice2) {
				  var differenze = [];
				  let nr = matrice.length; // numero di righe
				  let nc = matrice[0].length;
				  for (var i = 0; i < nr; i++) {
					for (var j = 0; j < nc; j++) {
					  if (matrice1[i][j] !== matrice2[i][j]) {
					    var nome = nomiRighe[i];
						var valore1 = matrice1[i][j];
						var valore2 = matrice2[i][j];
        				differenze.push({riga: i+1, colonna: j+1, valore1: matrice1[i][j], valore2: matrice2[i][j]});
						console.log(nomiRighe[i] + " " + frasi[valore2]+ " giorno " + j + " maggio.");
					  }
					}
				  }
				  return differenze;
			  }
			  
			  function salva() {
				confrontaMatrici(matrice, matriceAttuale);
			  }
			  
			  
			  function inviaDati() {
				var xhr = new XMLHttpRequest();
				var url = "salva_matrice.php";
				var data = "file=maggio2023&matrix=" + encodeURIComponent(JSON.stringify(matriceAttuale));

				xhr.open("POST", url, true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(data);
			  }
			  
  			  var matrice = [];			  
  			  var matriceAttuale = [];			  

			  
			  function caricaValori()
			  {
				  let nr = matrice.length; // numero di righe
				  let nc = matrice[0].length;
				  for (var i = 0; i < nr; i++){
					  var prefix = "cella-"+ (i-2);
					  if (i == 0) {
						  prefix = "scadenze";
					  }else if (i == 1){
						  prefix = "presidente";
					  }else if (i == 2){
						  prefix = "sg";
					  }
					  prefix = prefix + "-";
					  for (var j = 0; j < nc; j++){
						  var id = prefix+(j+1);
						  //console.log("id "+id+ ", valore "+ matrice[i][j]);
						  impostaClasse(document.getElementById(id),  matrice[i][j]);
						  document.getElementById(id).setAttribute("valore", matrice[i][j]);
						  if (i > 2) {
							document.getElementById(id).innerHTML = matrice[i][j];
						  }
					  }
				  }
			  }
			  
			  function caricaFunzioni() {
				  
			  }
			  
			  
			  function caricaNumeroGiorniLavorativi() {
				var xhr = new XMLHttpRequest();
				  xhr.open("GET", "consts/lavorativi"+year+".json", true);
				  xhr.onreadystatechange = function() {
					if (xhr.readyState === 4 && xhr.status === 200) {
					  var jsonAr = JSON.parse(xhr.responseText);
					  lavorativi = jsonAr[month-1];
					  
					}
				  };
			    xhr.send();
			  }
			  
			  
			  function processaMatrice() {
				var xhr = new XMLHttpRequest();
				  xhr.open("GET", "data/Maggio.json", true);
				  xhr.onreadystatechange = function() {
					if (xhr.readyState === 4 && xhr.status === 200) {
					  matrice = JSON.parse(xhr.responseText);
					  caricaValori();
					  caricaFunzioni();
					  caricaMatriceAttuale();
					  calcolaPercentualeUfficioIniziale();
					}
				  };
			    xhr.send();
			  }
			  
			  function caricaMatriceAttuale(){
				  matriceAttuale = matrice.slice();
			  }
			  
			  function start(){
				  caricaNumeroGiorniLavorativi();
				  processaMatrice();
			  }
			  
			</script>

		
		<style>
		  .cella {
			text-align: center;
			font-weight: bold;
			font-size: 18px;
			width: 30px;
			height: 30px;
			cursor: pointer;
		  }
		  
		  .celeste {
			background-color: #00aaff;
			color: white;
		  }
		  
		  .bianco {
			background-color: white;
			color: black;
		  }
		  
		  .verde {
			background-color: #00ff00;
			color: white;
		  }
		  
		  .gialla {
			background-color: yellow;
			color: black;
		  }
		  
		  .giallina {
			background-color: #FFD966;
			color: black;
		  }
		  
		  
		  .rossa {
			background-color: red;
			color: white;
		  }
		  
		  .blu {
			background-color: blue;
			color: white;
		  }
		  
		  .arancione {
			background-color: orange;
			color: white;
		  }
		  
		  table {
			border-collapse: collapse;
		  }

		  td, th {
			border: 1px solid black;
			text-align: center;
		  }
		  
		  .senza-bordi td, .senza-bordi th {
			border-top: none;
			border-bottom: none;
		  }
		  
		  html, body {
			height: 100%;
		  }

		  body {
			zoom: 0.85;
			font-family: Calibri, sans-serif;
			display: flex;
			justify-content: center;
			align-items: center;
		  }
		</style>

	</head>
	
	<body onload="start();">
		<table>
			  <thead>
				<tr>
				  <th>01/05/2023 - 31/05/2023</th>
				  <?php for ($i = 1; $i <= $days; $i++) { echo "<th>$i</th>\n";} ?>
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
								echo "<td id='scadenze-".$i."' onchange=\"aggiornaMatriceAttuale(this.getAttribute('id'));\" contenteditable='true'/>";
							}
						}else if (1 == $key) {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td id='presidente-".$i."' onclick='presidenteInSede(this)'; valore='A' class='cella'/>";
							}
						}else if (2 == $key) {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td id='sg-".$i."' onchange=\"aggiornaMatriceAttuale(this.getAttribute('id'));\" valore='A' contenteditable='true'/>";
							}
						}else {
							for ($i = 1; $i <= $days; $i++) {
								echo "<td class='cella' id='cella-".($key-2)."-".$i."' valore='X' onclick='cambiaValore(this)'>X</td>\n";
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
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td/>
				  <td colspan="3">Legenda</td>
			    </tr>
				<tr>
				  <th>Ufficio Ricorsi</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='ufficioRicorsi-".$i."'></td>\n";
					}
				   ?>
				  <td colspan="3">SW = Smart Working</td>
			    </tr>
				<tr>
				  <th>Segreteria Sezione I</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='sez1-".$i."'></td>\n";
					}
				   ?>
				  <td class="cella celeste" colspan="3">X = Presenza In Ufficio</td>
			    </tr>
				<tr>
				  <th>Segreteria Sezione II</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='sez2-".$i."'></td>\n";
					}
				   ?>
				  <td class="cella verde" colspan="3">F = Ferie</td>
			    </tr>
				<tr>
				  <th>URP</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='urp-".$i."'></td>\n";
					}
				   ?>
				  <td class="cella arancione" colspan="3">R = Recupero smart working</td>
			    </tr>
				<tr>
				  <th>Archivio</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='archivio-".$i."'></td>\n";
					}
				   ?>
				  <td class="cella blu" colspan="3">T = Smart working sabato</td>
			    </tr>
				<tr>
				  <th>Personale</th>
				 <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='personale-".$i."'></td>\n";
					}
				   ?>
				  <td colspan="3">A = Assenze a vario titolo</td>
			    </tr>
				<tr>
				  <th>Economato</th>
				  <?php 
					for ($i = 1; $i <= $days; $i++) {
						echo "<td id='economato-".$i."'></td>\n";
					}
				   ?>
				  <td colspan="3"/>
			    </tr>
				<tr id="comandi" style="display:none">
					<td class="senza-bordi" colspan="18">
						<button style="width:100%" onclick="salva()">Salva</button>
						</td>
					<td class="senza-bordi" colspan="18">
						<button style="width:100%">Annulla</button>
					  </td>
				</tr>
				
				
			</tbody>
		</table>	
	</body>
	
</html>