	
	var matrice = [];
	var matriceAttuale = [];
	var itMonths=["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
	var numDipendenti = 13;
	var numRows = numDipendenti + 3;
	var lavorativi = 0;
	var nomiRighe = [];
	
	var frasi = []
	frasi["X"]="sarà presente in ufficio";
	frasi["P"]="sarà presente in sede";
	frasi["A"]="sarà assente";
	frasi["T"]="sarà in turno sabato";
	frasi["F"]="sarà in ferie";
	frasi["SW"]="sarà in smart working";
	frasi["R"]="sarà in recupero turno del sabato";
	
	var indiciTabella = new Map();
	indiciTabella.set('presidente', 1);
	indiciTabella.set('sg', 2);
	// cella sarà gestito a parte
	indiciTabella.set('UfficioRicorsi',  numDipendenti + 3);      
	indiciTabella.set('SegreteriaSezioneII', 2 + numDipendenti + 3);      
	indiciTabella.set('SegreteriaSezioneI', 1 + numDipendenti + 3);      
	indiciTabella.set('URP', 3 + numDipendenti  + 3);      
	indiciTabella.set('Archivio', 4 + numDipendenti + 3);      
	indiciTabella.set('Personale', 5 + numDipendenti + 3);      
	indiciTabella.set('Economato', 6 + numDipendenti + 3);      
	indiciTabella.set('Protocollo', 7 + numDipendenti + 3);         
	
	function getMatrixIdxFromElementId(id){
		if (id.startsWith("cella")){
			var idx = parseInt(id.split("-")[1]);
			idx +=2;
			console.log("getMatrixIdxFromElementId("+id+"): Id di tipo cella, ritorno "+ idx);
			return idx;
		}
		
		for (let key of indiciTabella.keys()) {
		  if (id.indexOf(key) !== -1){
			  console.log("getMatrixIdxFromElementId("+id+"): chiave trovata: "+key+", ritorno "+indiciTabella.get(key));
			  return indiciTabella.get(key);
		  }
		}
		console.log("getMatrixIdxFromElementId("+id+"): nessuna corrispondenza trovata.");
		return 0;
	}
	
	function getDayFromElementId(id){
		var day = id.split("-")[1];
		if (id.startsWith("cella")){
			console.log("getDayFromElementId("+id+"): Id di tipo cella, ritorno "+ (day = id.split("-")[2]));
			return day;
		}
		if (id.startsWith("presidente")){
			console.log("getDayFromElementId("+id+"): Id di tipo presidente, ritorno "+day);
			return day;
		}
		if (id.startsWith("sg")){
			console.log("getDayFromElementId("+id+"): Id di tipo presidente, ritorno "+day);
			return day;
		}
		
		for (let key of indiciTabella.keys()) {
		  if (id.indexOf(key) !== -1){
			  console.log("getDayFromElementId("+id+"): chiave trovata: "+key+", ritorno "+ (day = id.split("-")[2]));
			  return day;
		  }
		}
		console.log("getMatrixIdxFromElementId("+id+"): nessuna corrispondenza trovata.");
		return day;
	}
	
	
	function aggiornaMatriceAttuale(id) {
		var actualFn = "aggiornaMatriceAttuale("+id+") ";
		var idx = getMatrixIdxFromElementId(id); var day = getDayFromElementId(id);
		//TODO: test getMatrixIdxFromElementId call
		//TODO: add handling of substitution				
		console.log(actualFn + "id: "+id+", idx="+idx+", day="+day);
		day = day - 1;
		//console.log(matriceAttuale);
		if (id.indexOf("scadenze")!== -1 || id.indexOf("sg") !== -1){
			console.log(actualFn+":Aggiorno "+id.indexOf("scadenze")!== -1 ? "la scadenza" : "la nota sg" +" id "+idx+", giorno "+(day+1)+" con "+document.getElementById(id).textContent);
			matriceAttuale[idx][day]=document.getElementById(id).textContent;
		}else {
			console.log(actualFn + "valore da impostare:"+document.getElementById(id).getAttribute("valore"));
			console.log(actualFn + "valore da attuale:"+matriceAttuale[idx][day]);
			matriceAttuale[idx][day]=document.getElementById(id).getAttribute("valore");
		}
		var comparisonResult = confrontaMatrici(matrice, matriceAttuale);
		var diff = comparisonResult.length;
		var newText = "Rilevat"+ (diff == 1 ? "a": "e") + " <strong>" +diff+ "</strong> variazion"+ (diff == 1 ? "e": "i") +"<br><br>"; 
		console.log(comparisonResult);
		for (var i=0; i < diff; i++){
			newText = newText + comparisonResult[i].log + "<br>" ;
		}
		setSaveModalBody(newText);
		//console.log("Differenze rilevate:" + diff);
		document.getElementById("comandi").style.display = (diff > 0)  ?  "table-row" : "none";
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
				let val = document.getElementById(cellName).getAttribute("valore");
				if (val == 'X' || val == 'F'){
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
				let val = document.getElementById(cellName).getAttribute("valore");
				if (val == 'X'){
					pres++;
				}else if (val == 'F'){
					ferie++;
				}
			document.getElementById("presUfficio-"+i).innerHTML = pres;
			document.getElementById("ferie-"+i).innerHTML = ferie;
			document.getElementById("percPresInd-"+i).innerHTML = (pres / lavorativi).toFixed(2);
			}
		}
	  }
	  
	  function impostaValore(id, nuovoValore){
		  //console.log("impostaValore("+id+", "+nuovoValore+")");
		  document.getElementById(id).setAttribute("valore", nuovoValore);
		  if (id.startsWith("div")) {
			  var selectId = id.replace("div", "select");
			  document.getElementById(selectId).value = nuovoValore;
			  nuovoValore == '' ? hideDiv(id) : showDiv(id);
			  if (nuovoValore != ''){
				  document.getElementById(selectId).style.width = 'auto';
			  }
		  }
	  }
	  
	  function impostaClasse(cella, nuovoValore){
		    //console.log("impostaClasse("+cella+","+nuovoValore+")");
		    if (cella.id.startsWith("div")) {
				return;
			}
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
			}else if (nuovoValore === "P") {
			  cella.classList.add("giallina");
			}
	  }
	  
	  function cambiaValoreIndietro(cella) {
			var valoreAttuale = cella.getAttribute("valore");
			var nuoviValori = ["R", "X","F", "SW", "A"];
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
		aggiornaMatriceAttuale(cella.getAttribute("id"));
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
	  
	  function confrontaMatrici(matrice1, matrice2) {
				  var differenze = [];
				  let nr = matrice1.length; // numero di righe
				  let nc = matrice1[0].length;
				  for (var i = 0; i < nr; i++) {
					for (var j = 0; j < nc; j++) {
					  if (matrice1[i][j] !== matrice2[i][j]) {
					    var nome = nomiRighe[i];
						var valore1 = matrice1[i][j];
						var valore2 = matrice2[i][j];
						console.log("confrontaMatrici ["+i+"]["+j+"] vecchio valore:"+matrice1[i][j]+", nuovo valore:"+matrice2[i][j]);
						var log; 
						if (i == 2){
							log = ("Nuovo appunto per SG: "+valore2+" giorno " + (j+1) + " "+itMonths[month]+".");
						}else {
							log = (nomiRighe[i] + " " + ((frasi[valore2] === undefined) ?   "sarà eseguito da "+valore2 : frasi[valore2]) + " giorno " + (j+1) + " "+itMonths[month]+".");
						}
						console.log(log);
        				differenze.push({riga: i+1, colonna: j+1, valore1: matrice1[i][j], valore2: matrice2[i][j], log: log});
					  }
					}
				  }
				  return differenze;
			  }
			  
			  
			  function showSelect(selectWrapper) {
				selectWrapper.querySelector('select').style.display = 'block';
			  }
			  
			  function hideSelect(selectWrapper) {
				if (selectWrapper.querySelector('select').value === '') {
				  selectWrapper.querySelector('select').style.display = 'none';
				}
			  }
			  
			  function checkValue(select) {
				if (select.value === '') {
				  select.style.display = 'none';
				}
			  }
			  
			  function salva() {
				inviaDati();
			  }
			  
			  
			  function inviaDati() {
				let xhr = new XMLHttpRequest();
				let url = "salvaMatrice.php"; // L'URL della pagina PHP che elabora la richiesta
				xhr.onreadystatechange = function() {
				  if (xhr.readyState === 4 && xhr.status === 200) {
						copiaMatrice(matriceAttuale, matrice);
						document.getElementById("comandi").style.display = "none";
						// Mostra l'alert di successo
						// Creazione del div alert
						var alert = document.createElement('div');
						alert.id = 'myAlert';
						alert.classList.add('alert', 'alert-success', 'fade', 'fixed-bottom');
						alert.textContent = '-';

						// Aggiunta del div alert al documento
						document.body.appendChild(alert);
						console.log(alert);	
						alert.innerHTML = xhr.responseText;
						alert.classList.add('show');
						setTimeout(function() {
						  alert.classList.remove('show');
						  setTimeout(function() {
							alert.remove();
						  }, 3000); // Tempo di animazione del fade-out
						}, 2000); // Durata dell'alert in millisecondi
				  }
				};
				var data = "mese=" + encodeURIComponent(itMonths[month]) + "&matrice=" + encodeURIComponent(JSON.stringify(matriceAttuale));
				console.log("Invio: "+data);
				xhr.open("GET", "salvaMatrice.php?" + data, true);
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.send(data); // Invia la richiesta con i dati della matrice

			  }
			  
			  function caricaValori()
			  {
				    var nomiDiv = []; 
					nomiDiv[0]="scadenze-";
					nomiDiv[1]="presidente-";
					nomiDiv[2]="sg-";
					for (var i = 3; i < 16; i++) {
					  nomiDiv[i] = "cella-"+ (i-2) + "-";
					}
					
					nomiDiv[16]="div-UfficioRicorsi-";
					nomiDiv[17]="div-SegreteriaSezioneI-";
					nomiDiv[18]="div-SegreteriaSezioneII-";
					nomiDiv[19]="div-URP-";
					nomiDiv[20]="div-Archivio-";
					nomiDiv[21]="div-Personale-";
					nomiDiv[22]="div-Economato-";
					nomiDiv[23]="div-Protocollo-";
					let nr = matrice.length; // numero di righe
					let nc = matrice[0].length;
					for (var i = 0; i < nr; i++){
					  var prefix = nomiDiv[i];
					  for (var j = 0; j < nc; j++){
						  var id = prefix+(j+1);
						  //console.log("caricaValori() id "+id+ ", valore "+ matrice[i][j]);
						  impostaClasse(document.getElementById(id),  matrice[i][j]);
						  impostaValore(id, matrice[i][j]);
						  if (i != 1  && i < 16 && (matrice[i][j] != 'S' &&  matrice[i][j] != 'D')) {
							document.getElementById(id).innerHTML = matrice[i][j];
						  }
					  }
					}
			  }
			  
			  var timerId;
			  
			  function caricaFunzioni() {
				  
				  //scadenze
				  for (var i = 1; i <= days; i++) {
						var element = document.getElementById('scadenze-'+i); //seleziono l'elemento da modificare
					    //console.log('scadenze-'+i+", valore della matrice "+ matrice[0][i-1]);
						if (matrice[0][i-1] != 'S' && matrice[0][i-1] != 'D'){
							element.oninput = function() { aggiornaMatriceAttuale(this.getAttribute('id')); }; //aggiungo la funzione onchange
							element.setAttribute("contenteditable", "true");
						}
				  }
				  
				  //presidente
				  for (var i = 1; i <= days; i++) {
						const currentId = 'presidente-'+i;
						var element = document.getElementById('presidente-'+i); //seleziono l'elemento da modificare
					    //console.log('scadenze-'+i+", valore della matrice "+ matrice[0][i-1]);
						if (matrice[1][i-1] != 'S' && matrice[1][i-1] != 'D'){
							element.onclick = function() { presidenteInSede(this); }; //aggiungo la funzione click
							element.onmousedown = function() { 
													timerId = setInterval(function() {
																			presidenteInSede(document.getElementById(currentId));
															}, 500);
												}; //aggiungo la funzione onmousedown
							element.onmouseup = function() { clearInterval(timerId);}; //aggiungo la funzione onmouseup
							element.onclick = function() { presidenteInSede(this); }; //aggiungo la funzione onclick
							
							
						}else {
							element.style.cursor = "auto";
						}
				  }
				  
				  //sg
				  for (var i = 1; i <= days; i++) {
						var element = document.getElementById('sg-'+i); //seleziono l'elemento da modificare
					    //console.log('scadenze-'+i+", valore della matrice "+ matrice[0][i-1]);
						if (matrice[2][i-1] != 'S' && matrice[2][i-1] != 'D'){
							element.oninput = function() { aggiornaMatriceAttuale(this.getAttribute('id')); }; //aggiungo la funzione onclick
							element.setAttribute("contenteditable", "true");
						}
				  }
				  
				  // dipendenti
				  for (var d = 1; d <= numDipendenti; d++){
					   for (var i = 1; i <= days; i++) {
						    const currentId = 'cella-'+d+'-'+i;
							var element = document.getElementById(currentId); //seleziono l'elemento da modificare
							//console.log('cella-'+d+'-'+i+", valore della matrice "+ matrice[d-1][i-1]);
							if (matrice[d-1][i-1] == 'S' || matrice[d-1][i-1] == 'T'){
								element.onclick = function() { turnoDelSabato(this); }; //aggiungo la funzione onchange
							}else if (matrice[d-1][i-1] != 'D'){
							    element.oncontextmenu=function(e) {e.preventDefault(); cambiaValoreIndietro(this); };
								element.onmousedown = function() { 
													timerId = setInterval(function() {
																			cambiaValore(document.getElementById(currentId));
															}, 500);
												}; //aggiungo la funzione onmousedown
								element.onmouseup = function() { clearInterval(timerId);}; //aggiungo la funzione onmouseup
								element.onclick = function() { cambiaValore(this); }; //aggiungo la funzione onclick								
							}
					   }
				   }
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
				  xhr.open("GET", "data/"+itMonths[month]+".json", true);
				  xhr.onreadystatechange = function() {
					if (xhr.readyState === 4 && xhr.status === 200) {
					  matrice = JSON.parse(xhr.responseText);
					  matriceAttuale = JSON.parse(xhr.responseText);
					  caricaValori();
					  caricaFunzioni();
					  //copiaMatrice(matrice, matriceAttuale);
					  calcolaPercentualeUfficioIniziale();
					}
				  };
			    xhr.send();
			  }
			  
			  function copiaMatrice(sourceMatrix, destMatrix){
				  for (var i = 0; i < numRows; i++) {
					destMatrix[i]=[];
					for (var j = 0; j < days; j++) {
						destMatrix[i][j] = sourceMatrix[i][j];
					}
				  }
			  }
			  
			  function mettiColonnaOggiInGrassetto() {
				  
				// si salta la prima colonna e quindi il numero del giorno è l'indice corretto  
				var colIndex = today;
				console.log("mettiColonnaOggiInGrassetto() Today:"+today);
				// Seleziona la tabella
				var table = document.getElementById("calendarTable");
				var size = 5;
				var color = "lime";
				// Itera su tutte le righe della tabella, a partire dalla seconda riga
				for (var i = 1; i < (table.rows.length - 1); i++) { //l'ultima riga contiene i bottoni

				  // Seleziona la cella corrispondente alla colonna desiderata
				  var cell = table.rows[i].cells[colIndex];

				  // Applica lo stile
				  cell.style = "border-left: "+size+"px solid "+color+"; border-right: "+size+"px solid "+color+"; ";
				}
				console.log("mettiColonnaOggiInGrassetto() th-"+today);
				document.getElementById("th-"+today).style = "border-top: "+size+"px solid "+color+"; border-left: "+size+"px solid "+color+"; border-right: "+size+"px solid "+color+"; "
				table.rows[table.rows.length - 2].cells[colIndex].style = "border-left: "+size+"px solid "+color+"; border-right: "+size+"px solid "+color+"; border-bottom: "+size+"px solid "+color+";"
				
			  }
			  
			  function setTitle() {
				document.getElementById('titleId').innerHTML = "&nbsp; &nbsp;Calendario Condiviso"; 
			  }
			  
			  function setShorterFooter() {
				document.getElementsByTagName('footer')[0].style="padding:0; height: 40px;";
				document.getElementById('footerDiv').style="margin:0";
			  }
			  
			  function start(){
				  caricaNumeroGiorniLavorativi();
				  processaMatrice();
				  mettiColonnaOggiInGrassetto();
				  setActiveNavBarLink('aree');
				  setShorterFooter();
				  setTitle();
			  }
			  
			  function esportaExcel() {
			  // Creazione della matrice dati
			  var data = matriceAttuale;

			  // Creazione del workbook
			  var workbook = XLSX.utils.book_new();
			  var sheet = XLSX.utils.aoa_to_sheet(data);
			  XLSX.utils.book_append_sheet(workbook, sheet, 'Dati');

			  // Creazione del file Excel
			  var wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

			  // Conversione in un oggetto Blob
			  var blob = new Blob([wbout], { type: 'application/octet-stream' });

			  // Creazione del link per il download del file
			  var url = window.URL.createObjectURL(blob);
			  var a = document.createElement('a');
			  a.href = url;
			  a.download = 'dati.xlsx';

			  // Aggiunta del link alla pagina e attivazione del click
			  document.body.appendChild(a);
			  a.click();

			  // Rimozione del link dalla pagina
			  document.body.removeChild(a);
			  window.URL.revokeObjectURL(url);
			}

			  
			  
			  function showDiv(id) { 
				//console.log("showDiv("+id+") div_onmouseover"); 
				document.getElementById(id).style.display='block';
				//aggiornaMatriceAttuale(id);
			  }
			  
			   function hideDiv(id) { 
   				//console.log("hideDiv("+id+") div_onmouseout"); 
				document.getElementById(id).style.display = (document.getElementById(id.replace("div", "select")).value == '' ? 'none' : 'block');
				//aggiornaMatriceAttuale(id);
			   }
			   
			   function setSelect(el) {
				   el.style.width = el.value == '' ? '30px' : 'auto';
				   var id = el.id.replace("select", "div");
				   document.getElementById(id).setAttribute("valore", el.value);
				   hideDiv(id);
				   aggiornaMatriceAttuale(id);
			   }
			  