<!DOCTYPE html>
<html lang="it">

<head>
    <?php echo file_get_contents('header.html'); ?>
</head>

<body style="display: block;position: static;overflow: visible;" onload="setActiveNavBarLink('home');">
    <?php echo file_get_contents('navbar.html'); ?>
    <main class="page landing-page">
        <section class="clean-block clean-hero" style="color: rgba(9, 162, 255, 0.85);background: url(&quot;assets/img/Athena.png&quot;);height: 727px;">
            <div class="text">
                <h2>Benvenuto</h2>
                <p>Iscriviti con il tuo indirizzo mail o accedi usando mail e password</p><a class="btn btn-outline-light btn-lg" role="button" data-bs-toggle="tooltip" data-bss-tooltip="" href="login.php" title="Clicca per entrare">Entra</a>
            </div>
        </section>
    </main>
    <?php echo file_get_contents('footer.html'); ?>
</body>

</html>