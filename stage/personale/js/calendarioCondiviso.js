	
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
	
	function aggiornaMatriceAttuale(id) {
		var actualFn = "aggiornaMatriceAttuale("+id+")";
		var idx = 0; var day = id.split("-")[1]; 
		if (id.indexOf("presidente")!== -1) {
			//console.log("Presidente da aggiornare");
			idx = 1;
		}else if (id.indexOf("sg")!== -1) {
			idx = 2;
		}else if (id.indexOf("cella")!== -1) {
			var subStrings = id.split("-");
			idx = parseInt(subStrings[1]) + 2;
			day = subStrings[2];
		}
		//TODO: add handling of substitution				
		day = day - 1;
		//console.log("id: "+id+", idx="+idx+", day="+day);
		//console.log(matriceAttuale);
		if (id.indexOf("scadenze")!== -1 || id.indexOf("sg") !== -1){
			console.log(actualFn+":Aggiorno "+id.indexOf("scadenze")!== -1 ? "la scadenza" : "la nota sg" +" id "+idx+", giorno "+(day+1)+" con "+document.getElementById(id).textContent);
			matriceAttuale[idx][day]=document.getElementById(id).textContent;
		}else {
			//console.log(id);
			//console.log("valore da impostare:"+document.getElementById(id).getAttribute("valore"));
			//console.log("valore da attuale:"+matriceAttuale[idx][day]);
			matriceAttuale[idx][day]=document.getElementById(id).getAttribute("valore");
		}
		
		var diff = confrontaMatrici(matrice, matriceAttuale).length;
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
        				differenze.push({riga: i+1, colonna: j+1, valore1: matrice1[i][j], valore2: matrice2[i][j]});
						if (i == 2){
							console.log("Nuovo appunto per SG: "+valore2+" giorno " + j + " "+itMonths[month]+".");
						}else {
							console.log(nomiRighe[i] + " " + frasi[valore2] + " giorno " + j + " "+itMonths[month]+".");
						}
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
				confrontaMatrici(matrice, matriceAttuale);
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
						  if (i != 1 && (matrice[i][j] != 'S' &&  matrice[i][j] != 'D')) {
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
					  caricaValori();
					  caricaFunzioni();
					  copiaMatrice(matrice, matriceAttuale);
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
				console.log("showDiv("+id+") div_onmouseover"); 
				document.getElementById(id).style.display='block';
				aggiornaMatriceAttuale(id);
			  }
			  
			   function hideDiv(id) { 
   				console.log("hideDiv("+id+") div_onmouseout"); 
				document.getElementById(id).style.display = (document.getElementById(id.replace("div", "select")).value == '' ? 'none' : 'block');
				aggiornaMatriceAttuale(id);
			   }
			   
			   function setSelect(el) {
				   el.style.width = el.value == '' ? '30px' : 'auto';
				   hideDiv("div"+el.id);
			   }
			  