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