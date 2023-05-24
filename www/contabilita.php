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
				  <a href="compensoAvvocatiGratuitoPatrocinio.php"><img src="assets/img/cardImg/calcoloCompensoGratuitoPatrocinio.jpg" class="card-img-top" alt="Contabilità"></a>
				  <div class="card-body">
					<center><h5 class="card-title" style="color: rgba(9, 162, 255, 0.85);">Compenso Avvocati Gratuito Patrocinio</h5></center>
				  </div>
				</div>
			  </div>
		 </div>
		</div>
    </main>
    <?php echo file_get_contents('footer.html'); ?>
</body>

</html>