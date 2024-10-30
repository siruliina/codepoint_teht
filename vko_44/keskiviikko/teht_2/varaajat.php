<?php
    include "yhteys_tietokantaan.php";

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add'])) {
        $nimi = $_POST['nimi'];

        // Lisää varaaja tietokantaan
        $sql_insert = "INSERT INTO varaajat (nimi) VALUES (:nimi)";
        $query_insert = $yhteys->prepare($sql_insert);
        $query_insert->bindParam(':nimi', $nimi);
        $query_insert->execute();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
        $id = $_POST['id'];
        $sql_delete = "DELETE FROM varaajat WHERE id = :id";
        $query_delete = $yhteys->prepare($sql_delete);
        $query_delete->bindParam(':id', $id);
        $query_delete->execute();
    }
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="author" content="Siru-Liina Karlin">
        <meta name="description" content="Tehtävä 2: Tilavaraus">
        <meta name="keywords" content="HTML, CSS, PHP">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="tilavaraus_style.css"/>
        <title>Varaajat</title>
    </head>
    <body>
        <header>
            <nav>
                <a href="index.php">Takaisin</a>
            </nav>
            <h1>Varaajat</h1>
        </header>

        <section>
            <h2>Lisää varaaja</h2>
            <form method="POST">
                <label for="nimi">Nimi</label><br/>
                <input type="text" name="nimi" id="nimi" required/><br/>
                
                <input type="submit" name="add" value="Lisää"/>
            </form>
        </section>

        <section>
            <h2>Kaikki varaajat</h2>
            <ul>
                <?php
                    $sql_select =  "SELECT * FROM varaajat";

                    $query= $yhteys->prepare($sql_select); 
                    $query->execute(); 

                    $varaajat= $query->fetchAll();

                    foreach ($varaajat as $varaaja) {
                        echo "<li>". $varaaja["nimi"] ."
                            <form method='POST' style='display: inline;'>
                                <input type='hidden' name='id' value='". $varaaja['id'] ."'/>
                                <input type='submit' name='delete' value='X'/>
                            </form>
                        </li>";
                    }
                ?>
            </ul>
        </section>
    </body>
</html>