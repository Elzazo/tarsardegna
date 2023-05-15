<!DOCTYPE html>
<html lang="it">

<head>
    <?php echo file_get_contents('header.html'); ?>
</head>

<body  onload="setActiveNavBarLink('contatti');">
    <?php echo file_get_contents('navbar.html'); ?>
    <main class="page contact-us-page">
        <section class="clean-block clean-form dark" style="height: 728px;">
            <div class="container">
                <div class="block-heading">
                    <h2 class="text-info">Contatti</h2>
                    <p>Inserisci la tua richiesta</p>
                </div>
                <form>
                    <div class="mb-3"><label class="form-label" for="name">Name</label><input class="form-control" type="text" id="name" name="name"></div>
                    <div class="mb-3"><label class="form-label" for="subject">Oggetto</label><input class="form-control" type="text" id="subject" name="subject"></div>
                    <div class="mb-3"><label class="form-label" for="email">Email</label><input class="form-control" type="email" id="email" name="email"></div>
                    <div class="mb-3"><label class="form-label" for="message">Message</label><textarea class="form-control" id="message" name="message"></textarea></div>
                    <div class="mb-3"><button class="btn btn-primary" type="submit">Send</button></div>
                </form>
            </div>
        </section>
    </main>
    <?php echo file_get_contents('footer.html'); ?>
</body>

</html>