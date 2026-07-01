<!DOCTYPE html>
    <html lang="fr">
    <meta charset="UTF-8">
    <title>
        <?= $this->renderSection('title') ?>
    </title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/5/w3.css">
    <script src="https://www.w3schools.com/lib/w3.js"></script>

    <script type="text/javascript">
        function openTabs(tabName) {

            var i;
            var x = document.getElementsByClassName("divTab");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            document.getElementById(tabName).style.display = "block";
        }
    </script>

    <?= $this->renderSection('head') ?>

<body>

    <?= $this->renderSection('topbar') ?>         




    <?= $this->renderSection('main') ?> 


   

</body>
</html>
