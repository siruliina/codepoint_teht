<?php
    include "yhteys_tietokantaan.php";

    // Tilan lisäys
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["add"])) {
        $nimi = $_POST["nimi"];
        $sql_insert = "INSERT INTO tilat (tilan_nimi) VALUES (:nimi)";
        $query_insert = $yhteys->prepare($sql_insert);
        $query_insert->bindParam(":nimi", $nimi);
        $query_insert->execute();
    }

    // Tilan poisto
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["delete"])) {
        $id = $_POST["id"];
        $sql_delete = "DELETE FROM tilat WHERE id = :id";
        $query_delete = $yhteys->prepare($sql_delete);
        $query_delete->bindParam(":id", $id);
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
        <title>Tilat</title>
    </head>
    <body>
        <header>
            <nav>
                <a href="index.php">Takaisin</a>
            </nav>
            <h1>Tilat</h1>
        </header>
       
        <section>
            <h2>Lisää tila</h2>
            <form method="POST">
                <label for="nimi">Tilan nimi</label>
                <input type="text" id="nimi" name="nimi" required>
                <input type="submit" name="add" value="Lisää">
            </form>
        </section>
        <section>
            <h2>Kaikki tilat</h2>
            <ul>
                <?php
                    $sql_select = "SELECT * FROM tilat";
                    
                    $query = $yhteys->prepare($sql_select);
                    $query->execute();

                    $tilat = $query->fetchAll();

                    foreach ($tilat as $tila) {
                        echo "<li>". $tila["tilan_nimi"] ."
                            <form method='POST' style='display: inline;'>
                                <input type='hidden' name='id' value='". $tila["id"] ."'>
                                <input type='submit' name='delete' value='X'>
                            </form>
                        ";
                    }
                ?>
            </ul>
        </section>
    </body>
</html>