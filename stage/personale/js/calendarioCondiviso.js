	var matrice = [];
	var matriceAttuale = [];
	if (year % 4 == 0) {
		// anno bisestile
		daysMonth[2] = 29;
	}
	
	
	var numDipendenti = 15;
	var numRows = numDipendenti + 3;
	var lavorativi = 0;
	var nomiRighe = [];
	var days = daysMonth[month];
	
	var version = 1;
	
	
	const indiciTabella = new Map();
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
		console.log("getMatrixIdxFromElementId("+id+")");
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
	
	// mantiene il testo della mail
	var comparisonContent = "";
	
	function aggiornaMatriceAttuale(id) {
		const actualFn = "aggiornaMatriceAttuale("+id+") ";
		const idx = getMatrixIdxFromElementId(id); let day = getDayFromElementId(id);
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
		const comparisonResult = confrontaMatrici(matrice, matriceAttuale);
		comparisonContent = "";
		const diff = comparisonResult.length;
		setDirty(diff > 0);
		let newText = "Rilevat"+ (diff == 1 ? "a": "e") + " <strong>" +diff+ "</strong> variazion"+ (diff == 1 ? "e": "i") +"<br><br>"; 
		console.log(comparisonResult);
		for (let i=0; i < diff; i++){
			comparisonContent = comparisonContent + comparisonResult[i].log + "<br>";
		}
		newText = newText + comparisonContent;
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
			  // gestione combo
			  if ("D" === nuovoValore || "S" === nuovoValore){
				  //console.log("impostaValore Nuovo valore "+nuovoValore+", ritorno");
				  return;
			  }
			  
			  let textDiv = document.getElementById(id.replace("div-", "div-text-"));
			  textDiv.innerHTML = nuovoValore;
		  }
	  }
	  
	  function impostaClasse(cella, nuovoValore){
		    //console.log("impostaClasse("+cella+","+nuovoValore+")");
			// niente stile per i div con le combo
		    if (cella.id.startsWith("div")) {
				return;
			}
			rimuoviClassiCella(cella);
			impostaClasseCellaDaValore(cella, nuovoValore);
	  }
	  
	
	  function cambiaValore(cella, ar = NUOVI_VALORI_AVANTI) {
			var valoreAttuale = cella.getAttribute("valore");
			var nuovoValore = ar[(ar.indexOf(valoreAttuale) + 1) % ar.length];
			cella.setAttribute("valore", nuovoValore);
			cella.innerHTML = nuovoValore;
			rimuoviClassiCella(cella);
			impostaClasseCellaDaValore(cella, nuovoValore);
			calcolaPercentualeUfficio(getLastSubstringFromId(cella));
			aggiornaMatriceAttuale(cella.id);
	  }
	  
	  function cambiaValoreIndietro(cella) {
			cambiaValore(cella, NUOVI_VALORI_INDIETRO);
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
	  
	  function getLog(indiceMatrice, vecchioValore, nuovoValore, giorno) {
		  let log = "";
		  if (indiceMatrice == 0) {
			log = (nuovoValore == "" ? "Rimossa scadenza da": "Nuova scadenza: '"+ nuovoValore+"'") + giorno + ".";
		  } else if (indiceMatrice == 1){
			log = "Il Presidente "+ (nuovoValore === undefined || nuovoValore === 'A' ? "non": "") +" sarà presente" + giorno + ".";
		  } else if (indiceMatrice == 2){
			log = (nuovoValore === undefined || nuovoValore === '' ? "Rimosso appunto SG per": "Nuovo appunto per SG: '"+nuovoValore+"'") + giorno + ".";
		  }else if (indiceMatrice >=dimensioneIntestazioni && indiceMatrice < (dimensioneIntestazioni + numDipendenti)) {
		  	if (vecchioValore == "T") {
				log = (nomiRighe[indiceMatrice] + " non sarà più in turno sabato "+ giorno +".");
			} else {
				log = (nomiRighe[indiceMatrice] + " " + frasi[nuovoValore] + giorno +".");
			}
		  }else {
			  if (nuovoValore === ""){
				log = nomiRighe[indiceMatrice] +  " non sarà più eseguito da " + vecchioValore + giorno +".";
			  } else {
				log = nomiRighe[indiceMatrice] +  " sarà eseguito da " + nuovoValore + giorno +".";
			  }
		  }
		  return log;
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
				var log = getLog(i, valore1, valore2, " giorno " + (j+1) + " "+itMonths[month])
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
	  
	  function showHideModal(modalId, show = true) {
		  var modal = document.getElementById(modalId);
		  $(modal).modal(show ? 'show' : 'hide');
	  }
	  
	  function salva() {
		setSpinner("saveModal", true);
		inviaDati();
		setSpinner("saveModal", false);
	  }
	  
	  
	  function inviaDati() {
		let xhr = new XMLHttpRequest();
		let url = "salvaMatrice.php"; // L'URL della pagina PHP che elabora la richiesta
		var data = "mese=" + encodeURIComponent(itMonths[month]) + "&anno="+encodeURIComponent(year)+"&matrice=" + encodeURIComponent(JSON.stringify(matriceAttuale));
		console.log("Invio: "+data);
		xhr.open("GET", "salvaMatrice.php?" + data, false);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(data); // Invia la richiesta con i dati della matrice
		
		if (xhr.readyState === 4 && xhr.status === 200) {
			copiaMatrice(matriceAttuale, matrice);
			setDirty(false);
			document.getElementById("comandi").style.display = "none";
			computeCalendarAsImage();
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
			// apre il prompt invio email
			document.getElementById("afterSaveModalBody").innerHTML=getSaveModalBody();
			// mostra la finestra modale di salvataggio
			showHideModal('afterSaveModal');			
			// reimposta il title
			setTitle();
		}
		
		

	  }
	  
	  function setInnerValue(el, val){
		  //console.log("setInnerValue("+el.id+", "+val+")");
		  if (val === "S" || val === "D") {
			  return;
		  }
		  if (el.id.startsWith("div-")){
			  document.getElementById(el.id.replace("div-", "div-text-")).innerHTML = val;
			  if (val !== ""){
				 //showDiv(el.id);
				 let sel = document.getElementById(el.id.replace("div", "select"));
				 if (sel !== null) {
					sel.value = val;
				 }
			  }
		  }else if (el.id.startsWith("presidente")){
			  return;
		  }else {
			  el.innerHTML = val;
		  }
	  }
	  
	  function removeMouseEvents(el, val) {
		  if (el.id.startsWith("div") && (val === "S" || val === "D")) {
			el.parentElement.removeAttribute("onmouseover");
			el.parentElement.removeAttribute("onmouseout");
		  }
	  }
	  
	  
	  
	  function caricaValori()
	  {
			const nomiDiv = []; 
			nomiDiv[0]="";
			nomiDiv[1]="scadenze-";
			nomiDiv[2]="presidente-";
			nomiDiv[3]="sg-";
			for (let i = 1; i <= numDipendenti; i++) {
			  nomiDiv[i + dimensioneIntestazioni] = "cella-"+ i + "-";
			}
			
			nomiDiv[dimensioneIntestazioni + numDipendenti + 1] = "div-UfficioRicorsi-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 2] = "div-SegreteriaSezioneI-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 3] = "div-SegreteriaSezioneII-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 4] = "div-URP-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 5] = "div-Archivio-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 6] = "div-Personale-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 7] = "div-Economato-";
			nomiDiv[dimensioneIntestazioni + numDipendenti + 8] = "div-Protocollo-";
			const nr = matrice.length;
			const nc = matrice[0].length;
			//console.log("caricaValori() Matrice da processare con "+nr+" righe e "+nc+" colonne");
			for (let i = 1; i <= nr; i++){
			  var prefix = nomiDiv[i];
			  for (let j = 1; j <= nc; j++){
				  const id = prefix+j;
				  const val = matrice[i-1][j-1];
				  const el = document.getElementById(id);
				  //console.log("caricaValori() id "+id+ ", valore "+ matrice[i][j]);
				  impostaClasse(el,  val);
				  impostaValore(id, val);
				  setInnerValue(el, val);
				  removeMouseEvents(el, val);				  
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
		  xhr.open("GET", "data/"+year+"/"+itMonths[month]+".json?data="+ Date.now(), true); // argomento utile per evitare il comportamento con la cache
		  xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
			  matrice = JSON.parse(xhr.responseText);
			  matriceAttuale = JSON.parse(xhr.responseText);
			  caricaValori();
			  if (typeof caricaFunzioni === 'function') {
					caricaFunzioni();
			  }
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
	  
	  function setUnsetColumnBorderBold(table, bold = true, prefix = "") {
		  if (today == -1) {
			return; 
		}
		// si salta la prima colonna e quindi il numero del giorno è l'indice corretto
		// se va saltata la riga della colonna che contiene la freccia a sinistra aggiungiamo 1
		let colIndex =  document.getElementById(prefix+'leftArrow') === null ? today : today + 1;
		//console.log("setUnsetColumnBorderBold(table, bold) tableId: "+table.id+", bold: "+bold+", Today:"+today);
		let size = bold ? 5 : 1;
		let color = bold ? "lime" : "black";
		// Itera su tutte le righe della tabella, a partire dalla seconda riga (prima header)
		let len = table.rows.length - 2;
		//console.log("setUnsetColumnBorderBold numero delle celle da impostare per bold:"+len);
		var showCursor = "cursor:" + (isAllowed ? "pointer;" : "auto;") + " ";
		const innerStyle = showCursor + "border-left: "+size+"px solid "+color+"; border-right: "+size+"px solid "+color+";";
		for (let i = 1; i < len; i++) { //l'ultima riga contiene i bottoni
		  // Seleziona la cella corrispondente alla colonna desiderata
		  let cell = table.rows[i].cells[colIndex];
		  //console.log("setUnsetColumnBorderBold Applico lo stile "+innerStyle+" alla cella "+cell.id);
		  // Applica lo stile
		  cell.style = innerStyle;
		}
		
		let headCellStyle =  showCursor + "border-left: "+size+"px solid "+color+"; border-right: "+size+"px solid "+color+"; border-top: "+size+"px solid "+color+";";
		let headCell = document.getElementById(prefix+"th-"+today);
        //console.log("setUnsetColumnBorderBold Applico lo stile "+headCellStyle+" alla cella di testa "+headCell.id);
		headCell.style = headCellStyle;
		let footCellStyle = showCursor + "border-left: "+size+"px solid "+color+"; border-right: "+size+"px solid "+color+"; border-bottom: "+size+"px solid "+color+";";
		let footCell = table.rows[len].cells[colIndex];
        //console.log("Applico lo stile "+footCellStyle+" alla cella di coda "+footCell.id);
		footCell.style = footCellStyle;
	  }
	  
	  function rimuoviColonnaOggiGrassetto(table = document.getElementById("calendarTable"), prefix = "") {
		setUnsetColumnBorderBold(table, false, prefix);
	  }
	  
	  function mettiColonnaOggiInGrassetto(table = document.getElementById("calendarTable"), prefix = "") {
		setUnsetColumnBorderBold(table, true, prefix);
	  }
	  
	  function setTitle() {
		version = getFileContentWithAjaxSync("contaRevisioni.php", ["mese", "anno"], [itMonths[month], year]);
		document.getElementById('titleId').innerHTML = "&nbsp; &nbsp;Calendario Condiviso - "+itMonths[month]+" "+year + " ver. " + version; 
	  }
	  
	  function setMonthInterval() {
		  document.getElementById("monthThId").innerHTML = "01/"+month+"/"+year+" - "+daysMonth[month] + "/" + month + "/"+ year;
	  }
	  
	  function setShorterFooter() {
		document.getElementsByTagName('footer')[0].style="padding:0; height: 40px;";
		document.getElementById('footerDiv').style="margin:0";
	  }
	  
	  
	  var leftComplete = false, rightComplete = false;
	  
	  function aggiungiBottoneMese(successivo){
		  const offset = successivo ? 1 : -1;
		  let newMonth = (month + offset) % 13;
		  const newYear = newMonth ==  0 ? year + offset: year;
		  newMonth = newMonth == 0 ? 1 : newMonth;
		  const monthStr = itMonths[newMonth];
		  
		  
		  const url = "data/"+newYear+"/"+monthStr+".json";
		  const xhr = new XMLHttpRequest();
		  
		  xhr.open('HEAD', url);
		  xhr.onreadystatechange = function() {
		    if (xhr.readyState === 4) {
				if (xhr.status === 200) {
				  //console.log('Creo il bottone con '+newMonth+" "+newYear);
				  // Crea l'URL con la query string
				  const currentUrl = window.location.href.split('?')[0]; // removes any current arg
				  const separator = currentUrl.includes('?') ? '&' : '?';
				  const newUrl = currentUrl + separator + 'month=' + encodeURIComponent(newMonth) + '&year=' + newYear;
				  const table = document.getElementById('calendarTable');
					// Creare una nuova colonna
				  const newFirstColumn = document.createElement('td');
				  newFirstColumn.style.height = table.offsetHeight + 'px';
				  const commonStyle = (successivo ? "border-right: none;" : "border-left: none;") + " border-bottom: none; border-top: none; width:32px; font-weight: bold;";
				  let idx = 0; let cells = [];
				  table.querySelectorAll('tr').forEach(function(row) {
					var newCell = document.createElement('td');
					successivo ? row.appendChild(newCell) : row.insertBefore(newCell, row.firstChild);
					newCell.style = commonStyle;
					cells[idx++] = newCell;
				  });
				  
				  const arrowCell = cells[idx / 2];
				  arrowCell.innerHTML = successivo ? ">" : "<";
				  arrowCell.id = (successivo ? "right" : "left") + "Arrow";
				  arrowCell.style = commonStyle + "cursor: pointer;";
				  
				  arrowCell.setAttribute("data-toggle", "tooltip");
				  arrowCell.setAttribute("data-placement", "top");
				  arrowCell.setAttribute("title", "Vai a "+monthStr+" "+newYear);
				   // Reindirizza alla nuova pagina con gli argomenti aggiunti sul click
				  arrowCell.onclick=function(){window.location.href = newUrl;};
				} else {
					console.log("aggiungiBottoneMese("+offset == 1 +") File non trovato, freccia non aggiunta.");
				}
				
				if (successivo) {
					//console.log("aggiungiBottoneMese(successivo): AJAX Complete");
					rightComplete = true;
				}else {
					//console.log("aggiungiBottoneMese(precedente): AJAX Complete");
					leftComplete = true;
				}
				
		    }
		  };
		  
		  xhr.send();
	  }
	  
	  function aggiungiColonneMesePrecedenteSuccessivo() {
			var successivo = true, precedente = false;
			aggiungiBottoneMese(precedente);
			aggiungiBottoneMese(successivo);
	  }
	  
	  function setProperSaveButtonColspan(){
		  var cancelButton = document.getElementById("cancelButton");
		  var colSpans = (days + 4) / 2; 
		  document.getElementById("cancelButton").setAttribute("colspan", colSpans);
		  document.getElementById("saveButton").setAttribute("colspan", days % 2 == 1 ? colSpans + 1 : colSpans);
	  }
	  
	  function start(){
		  caricaNumeroGiorniLavorativi();
		  mettiColonnaOggiInGrassetto();
		  setMonthInterval();
		  processaMatrice();
		  fireCustomEvent(AFTER_LOAD_EVENT_NAME);
		  aggiungiColonneMesePrecedenteSuccessivo();
		  setActiveNavBarLink('aree');
		  setShorterFooter();
		  setTitle();
		  setProperSaveButtonColspan();
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
	//cancello il contenuto del div di testo
	let textDiv = document.getElementById(id.replace("div-", "div-text-"));
	textDiv.innerHTML="";
	// mostro il div che contiene la combo
	let div = document.getElementById(id);
	div.style.display='block';
	//div.parentElement.innerHTML = "";
	//aggiornaMatriceAttuale(id);
  }
  
   function hideDiv(id) { 
	//console.log("hideDiv("+id+") div_onmouseout");
	const sel = document.getElementById(id.replace("div", "select"));
	if (sel != undefined && sel.value !== undefined ) {
		// nascondo la combo
		document.getElementById(id).style.display = 'none';
		// imposto il contenuto della select come testo del div di testo
		let textDiv = document.getElementById(id.replace("div-", "div-text-"));
		textDiv.innerHTML = sel.value;
	}
   }
   
   function setSelect(el) {
	   el.style.width = el.value == '' ? '30px' : 'auto';
	   var id = el.id.replace("select", "div");
	   document.getElementById(id).setAttribute("valore", el.value);
	   hideDiv(id);
	   aggiornaMatriceAttuale(id);
   }
	   
	   
   function postAjaxCall(url, formData, okCallback = undefined, errorCallback = undefined) {
		// Creazione della richiesta Ajax
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);

		// Gestione dell'evento di completamento della richiesta
		xhr.onload = function() {
			if (xhr.status === 200) {
				var response = xhr.responseText;
				// Gestisci la risposta dal server
				console.log(response);
				if (okCallback !== undefined) {
					console.log('chiamo la callback ok');
					okCallback();
				}
				
			} else {
				// Errore nella richiesta
				console.log("Errore nella richiesta. Codice status: " + xhr.status);
				if (errorCallback !== undefined){
					console.log('chiamo la callback error');
					errorCallback();
				}
			}
		};

		// Invio della richiesta
		xhr.send(formData);
		
	}
	
	// mantiene la versione immagine della tabella attualmente salvata
	var imgData;
	
	function cloneTable(sourceTable, idPrefix = clonedPrefix){
		const clonedTable = sourceTable.cloneNode(true);
		clonedTable.id = idPrefix + "CalendarTable";
		// Recupera tutti gli elementi con ID nella tabella clonata
		const clonedElements = clonedTable.querySelectorAll("[id]");
		// Aggiunge la stringa "cloned" agli ID degli elementi clonati
		clonedElements.forEach(function(element) {
			let originalId = element.id;
			let clonedId = idPrefix + originalId;
			element.id = clonedId;
			console.log("cloned cell id "+clonedId);
		});
		return clonedTable;
	}
	
	function cloneCalendarTable() {
		return cloneTable(document.getElementById('calendarTable'), clonedPrefix);
	}
	
	function computeCalendarAsImage() {
		const clonedTable = cloneCalendarTable();
		//const par = document.getElementById("calendarTableDiv");
		const par = document.getElementById("converterDiv");
		par.appendChild(clonedTable);
		rimuoviColonnaOggiGrassetto(clonedTable, clonedPrefix);
		removeTrailingColumnsFromTable(clonedTable);
		
		html2canvas(clonedTable).then(function (canvas) {
			// Convertire il canvas in un'immagine
		   console.log("getCalendarTableAsImageTag() Conversione completata");
		   imgData = canvas.toDataURL();
		   par.removeChild(clonedTable);
		});	
	}
		
	function getCalendarTableAsImageTag(){
		let img = document.createElement('img');
		img.src = imgData;
		return img;
	}
	
	function setSpinner(modalId, set = true) {
		document.getElementById(modalId + "SaveButton").style = set ? "display:none" : "display:initial";
		document.getElementById(modalId + "Spinner").style= set ? "display:initial" : "display:none";
	}
	
	function resetSendEmailButtonLogic() {
		setSpinner("afterSaveModal", false);
	}
	
			
	function sendEmailButtonLogic() {
		setSpinner("afterSaveModal", true);
		sendEmail(resetSendEmailButtonLogic);
	}
			
	function sendEmail(callback = undefined) {
		let img = getCalendarTableAsImageTag();
		let formData = new FormData();
		formData.append("oggetto", "Programmazione presenze ufficio "+itMonths[month]);
		formData.append("corpo", "<html><head/><body>Versione "+version+"<br/><br/>Modifiche rispetto al precedente inoltro<br/>"+rimpiazzaAccentate(comparisonContent)+"<br/>"+img.outerHTML+"</body></html>");
		formData.append("mittente", "a.lezza@giustizia-amministrativa.it");
		formData.append("distributionListTo", "dipendenti");
		formData.append("distributionListCc", "sg");
		postAjaxCall("sendMail.php", 
					    formData, 
						function() { showHideModal('afterSaveModal', false); showHideModal('okSentEmailModal'); if (callback !== undefined) {callback();} }, 
						function() { showHideModal('afterSaveModal', false); showHideModal('errorSentEmailModal');  if (callback !== undefined) {callback();}}
						);
		
	}

	// non funziona a causa del body troppo grande
	function composeMail() {
	  let recipients = toTokenizedString(getFileContentWithAjaxSync("consts/address/email/dipendenti.txt"), "\r\n", ";");
	  let cc =  toTokenizedString(getFileContentWithAjaxSync("consts/address/email/cc.txt"), "\r", ";");
	  let subject = 'Programmazione presenze ufficio mese di '+itMonths[month];
	  let content = "<html><head/><body>Versione "+version+"<br/>"+getCalendarTableAsImageTag().outerHTML+"</body></html>";
	  
	  let encodedRecipients = encodeURIComponent(recipients);
	  let encodedCC = encodeURIComponent(cc);
	  let encodedSubject = encodeURIComponent(subject);
	  let encodedContent = encodeURIComponent(content);
	  
	  let mailtoLink = 'mailto:' + encodedRecipients + '?cc=' + encodedCC + '&subject=' + encodedSubject ;//+ '&body=' + encodedContent;
	  console.log(mailtoLink);
	  window.location.href = mailtoLink;
	}

	
	function afterLoad() {
		// cose da fare una volta che il load è completato, chiamata da header
		/*console.log("calendarioCondiviso.js afterLoad()");
		var computedStyle = window.getComputedStyle(document.getElementById("calendarTable"));
		var width = computedStyle.width;
		console.log("afterLoad calendarTable has size:"+width);
		var div = document.getElementById("commandsDiv");
		var newStyle = div.getAttribute("style") + " " + "width:"+width;
		console.log("afterLoad new div style:"+newStyle);
		div.setAttribute("style", newStyle);*/
	}		  