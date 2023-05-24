<!DOCTYPE html>
<html lang="it">
<head>
    <?php echo file_get_contents('header.html'); ?>
	<style>
		.card-custom {
			height:250px;
		}
		
		.align-right {
			text-align: center;
		}
		
		.bold {
			font-weight: bold;
		}
	</style>
	<script>
	function calcola (onorario) {
		onorario = parseFloat(onorario);
		//console.log(onorario);
		var spese = onorario * 0.15;
		if (isNaN(spese)){
			return calcola (0);
		}
		//console.log(spese);
		document.getElementById("spese").innerHTML = spese.toFixed(2)+" €";
		var cpa = (onorario + spese) * 0.04;
		//console.log(cpa);
		document.getElementById("cpa").innerHTML = cpa.toFixed(2)+" €";
		var iva = (onorario + spese + cpa) * 0.22;
		//console.log(iva);
		document.getElementById("iva").innerHTML = iva.toFixed(2)+" €";
		var ritenuta = (onorario + spese) * 0.20;
		//console.log(ritenuta);
		document.getElementById("ritenuta").innerHTML = ritenuta.toFixed(2)+" €";
		var totale = (onorario + spese + cpa + iva);
		//console.log(totale);
		document.getElementById("totale").innerHTML = totale.toFixed(2)+" €";
		var netto = (totale - ritenuta);
		//console.log(netto);
		document.getElementById("netto").innerHTML = netto.toFixed(2)+" €";
	}
	</script>
	
</head>

<body style="display: block;position: static;overflow: visible;" onload="setActiveNavBarLink('aree');">
    <?php echo file_get_contents('navbar.html'); ?>
    <main class="page landing-page">
		<div class="container">
			 <center style="margin-top: 10px;"><h5 class="card-title" style="color: rgba(9, 162, 255, 0.85);">Calcolo Compenso Avvocati Gratuito Patrocinio</h5></center></center>
			 <center>
				 <div class="col-3" style="margin-top: 10px;">
					 <table class="table table-bordered table-striped" style="margin-top: 10px;">
						  <tbody>
							<tr>
							  <td class="align-right">Onorario</td>
							  <td><input type="number" min="0.0" class="form-control numeric-input" onchange="calcola(this.value);" onkeyup="calcola(this.value);" value="0.00" data-toggle="tooltip" data-placement="right" title="Usare la virgola per separare i decimali e NON usare il punto per separare le migliaia"></td>
							</tr>
							<tr>
							  <td class="align-right">Spese (15% onorario)</td>
							  <td id="spese">0.00 €</td>
							</tr>
							<tr>
							  <td class="align-right">CPA (4% di Onorario + Spese)</td>
							  <td id="cpa">0.00 €</td>
							</tr>
							<tr>
							  <td></td>
							  <td></td>
							</tr>
							<tr>
							  <td class="align-right">IVA<br>(22% di Onorario + Spese + CPA)</td>
							  <td id="iva">0.00 €</td>
							</tr>
							<tr>
							  <td class="align-right">Ritenuta d'acconto<br>(20% di Onorario + Spese)</td>
							  <td class="bold" id="ritenuta">0.00 €</td>
							</tr>
							<tr>
							  <td></td>
							  <td></td>
							</tr>
							<tr>
							  <td class="align-right">Totale documento</td>
							  <td class="bold" id="totale">0.00 €</td>
							</tr>
							<tr>
							  <td class="align-right">Netto a pagare</td>
							  <td class="bold" id="netto">0.00 €</td>
							</tr>
						  </tbody>
					</table>
				</div>
			</center>
		</div>
    </main>
    <?php echo file_get_contents('footer.html'); ?>
</body>

</html>