<!DOCTYPE html>
<html lang="it">

<head>
    <?php echo file_get_contents('header.html'); ?>
	<style>
		.card-custom {
			height:250px;
		}
	</style>
</head>

<body style="display: block;position: static;overflow: visible;" onload="setActiveNavBarLink('aree');">
    <?php echo file_get_contents('navbar.html'); ?>
    <main class="page landing-page">
		<div class="container">
		 <div class="row" style="margin-top: 20px;  margin-bottom: 20px;">
			  <div class="col-3">
				<div class="card">
				  <img src="assets/img/cardImg/calendario.jpg" class="card-img-top" alt="Calendario">
				  <div class="card-body">
					<center><h5 class="card-title" style="color: rgba(9, 162, 255, 0.85);">Calendario</h5></center>
				  </div>
				</div>
			  </div>
			  <div class="col-3">
				<div class="card">
				  <img src="assets/img/cardImg/giurisdizionale.jpg" class="card-img-top" alt="Giurisdizionale">
				  <div class="card-body">
					<center><h5 class="card-title" style="color: rgba(9, 162, 255, 0.85);">Giurisdizionale</h5></center>
				  </div>
				</div>
			  </div>
			  <div class="col-3">
				<div class="card">
				  <img src="assets/img/cardImg/contabilita.jpg" class="card-img-top" alt="Contabilità">
				  <div class="card-body">
					<center><h5 class="card-title" style="color: rgba(9, 162, 255, 0.85);">Contabilità</h5></center>
				  </div>
				</div>
			  </div>
			  <div class="col-3">
				<div class="card">
				  <img src="assets/img/cardImg/personale.jpg" class="card-img-top" alt="Personale">
				  <div class="card-body">
					<center><h5 class="card-title" style="color: rgba(9, 162, 255, 0.85);">Personale</h5></center>
				  </div>
				</div>
			  </div>
		 </div>
		</div>
    </main>
    <?php echo file_get_contents('footer.html'); ?>
</body>

</html>