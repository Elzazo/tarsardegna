const itMonths=["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const daysMonth = [0, 31, 28, 31, 30, 31, 30 , 31 , 31, 30, 31, 30, 31];

const PRESENTE = "X";
const ASSENTE = "A";
const PRESIDENTE_PRESENTE_SEDE = "P";
const TURNO_SABATO = "T";
const FERIE = "F";
const SMART_WORKING = "SW";
const RECUPERO_SABATO = "R";
const SABATO = "S";
const DOMENICA = "D";


const NUOVI_VALORI_INDIETRO = ["F", "R","A", "SW", "X"];
const NUOVI_VALORI_AVANTI = ["X", "SW", "A", "R", "F"];


var frasi = [];
frasi[PRESENTE] ="sarà presente in ufficio";
frasi[PRESIDENTE_PRESENTE_SEDE] ="sarà presente in sede";
frasi[ASSENTE] ="sarà assente";
frasi[TURNO_SABATO] ="sarà in turno sabato";
frasi[FERIE] ="sarà in ferie";
frasi[SMART_WORKING]="sarà in smart working";
frasi[RECUPERO_SABATO] ="sarà in recupero turno del sabato";

const CLASSE_CELESTE   = "celeste"; 
const CLASSE_BIANCO    = "bianco";
const CLASSE_VERDE     = "verde";
const CLASSE_GIALLA    = "gialla";
const CLASSE_GIALLINA  = "giallina";
const CLASSE_ROSSA     = "rossa";
const CLASSE_ARANCIONE = "arancione";

var LISTA_CLASSI_CELLA = [];
LISTA_CLASSI_CELLA[0] = CLASSE_CELESTE;
LISTA_CLASSI_CELLA[1] = CLASSE_BIANCO;
LISTA_CLASSI_CELLA[2] = CLASSE_VERDE;
LISTA_CLASSI_CELLA[3] = CLASSE_GIALLINA;
LISTA_CLASSI_CELLA[4] = CLASSE_ARANCIONE;
LISTA_CLASSI_CELLA[5] = CLASSE_GIALLA;
LISTA_CLASSI_CELLA[6] = CLASSE_ROSSA;

const CLASSI_CELLA_VALORI = new Map();
CLASSI_CELLA_VALORI.set(PRESENTE, CLASSE_CELESTE);
CLASSI_CELLA_VALORI.set(PRESIDENTE_PRESENTE_SEDE, CLASSE_GIALLINA);
CLASSI_CELLA_VALORI.set(ASSENTE, CLASSE_BIANCO);
CLASSI_CELLA_VALORI.set(TURNO_SABATO, CLASSE_CELESTE);
CLASSI_CELLA_VALORI.set(FERIE, CLASSE_VERDE);
CLASSI_CELLA_VALORI.set(SMART_WORKING, CLASSE_BIANCO);
CLASSI_CELLA_VALORI.set(RECUPERO_SABATO, CLASSE_ARANCIONE);
CLASSI_CELLA_VALORI.set(SABATO, CLASSE_GIALLA);
CLASSI_CELLA_VALORI.set(DOMENICA, CLASSE_ROSSA);

const clonedPrefix = "cloned-";


function rimuoviClassiCella(cella) {
	if (cella !== undefined || cella.classList !== undefined) {
		LISTA_CLASSI_CELLA.forEach(function(c) {
		  cella.classList.remove(c);
		});
	}	
}

function impostaClasseCellaDaValore(cella, nuovoValore){
	//console.log("impostaClasseCellaDaValore("+cella.id+", "+nuovoValore+")");
	if (cella !== undefined && nuovoValore !== undefined){
		cella.classList.add(CLASSI_CELLA_VALORI.get(nuovoValore));
	}
}

function getLastSubstringFromId(el) {
	const id = el.getAttribute("id");
	const subStrings = el.getAttribute("id").split("-");
	const lastSubstring = subStrings[subStrings.length - 1];
	return lastSubstring;
}