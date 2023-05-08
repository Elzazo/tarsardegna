<!DOCTYPE html>
<html>
<head>
	<title>Tabella Bootstrap</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
	<style>
		table {
			table-layout: fixed;
		}
		td {
			width: calc(100% / 40);
			height: 20px;
			text-align: center;
			vertical-align: middle;
		}
		
		body {
			zoom: 0.70;
		}
	</style>
</head>
<body>
	<div class="container-fluid">
		<!--h1>Tabella Bootstrap</h1-->
		<table class="table table-bordered table-hover">
			<thead class="thead-dark">
				<tr>
					<th>01-01-2023 / 31-01-2023</th>
					<?php for ($i = 1; $i <= 37; $i++) { ?>
						<th><?php echo $i; ?></th>
					<?php } ?>
				</tr>
			</thead>
			<tbody>
				<?php for ($i = 1; $i <= 25; $i++) { ?>
					<tr>
						<th scope="row"><?php echo $i; ?></th>
						<?php for ($j = 1; $j <= 37; $j++) { ?>
							<td><?php echo $i . ',' . $j; ?></td>
						<?php } ?>
					</tr>
				<?php } ?>
			</tbody>
		</table>
	</div>
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
</body>
</html>
