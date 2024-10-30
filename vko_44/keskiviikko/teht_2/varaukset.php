<?php
    include "yhteys_tietokantaan.php";

    // Varauksen lisäys
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["add"])) {
        $varauspaiva = $_POST["varauspaiva"];
        $tila = $_POST["tila"];
        $varaaja = $_POST["varaaja"];

        $sql_insert = "INSERT INTO varaukset (varauspaiva, tila, varaaja) VALUES (:varauspaiva, :tila, :varaaja)";
        $query_insert = $yhteys->prepare($sql_insert);
        $query_insert->bindParam(":varauspaiva", $varauspaiva);
        $query_insert->bindParam(":tila", $tila);
        $query_insert->bindParam(":varaaja", $varaaja);
        $query_insert->execute();
    }

    // Varauksen poisto
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["delete"])) {
        $id = $_POST["id"];

        $sql_delete = "DELETE FROM varaukset WHERE id = :id";
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
        <title>Varaukset</title>
    </head>
    <body>
        <header>
            <nav>
                <a href="index.php">Takaisin</a>
            </nav>
            <h1>Varaukset</h1>
        </header>

        <section>
            <h2>Lisää varaus</h2>
            <form method="POST">
                <label for="varauspaiva">Varauspäivä</label>
                <input type="date" name="varauspaiva" id="varauspaiva"/><br/>

                <label for="tila">Tila</label>
                <select name="tila" id="tila">
                    <option value='' disabled selected>Valitse tila</option>
                    <?php
                        $sql_select_tilat = "SELECT * FROM tilat";
                        $query_select_tilat = $yhteys->prepare($sql_select_tilat);
                        $query_select_tilat->execute();
                    
                        $tilat = $query_select_tilat->fetchAll();

                        foreach ($tilat as $tila) {
                            echo "
                                <option value=". $tila["id"] .">". $tila["tilan_nimi"] ."</option>
                            ";
                        }
                    ?>
                </select><br/>

                <label for="varaaja">Varaaja</label>
                <select name="varaaja" id="varaaja">
                    <option value='' disabled selected>Valitse varaaja</option>
                    <?php
                        $sql_select_varaajat = "SELECT * FROM varaajat";
                        $query_select_varaajat = $yhteys->prepare($sql_select_varaajat);
                        $query_select_varaajat->execute();
                    
                        $varaajat = $query_select_varaajat->fetchAll();

                        foreach ($varaajat as $varaaja) {
                            echo "
                                <option value=". $varaaja["id"] .">". $varaaja["nimi"] ."</option>
                            ";
                        }
                    ?>
                </select><br/>

                <input type="submit" name="add" value="Lisää varaus"/>
            </form>
        </section>

        <section>
            <h2>Kaikki varaukset</h2>
            <table>
                <tr>
                    <th>Päivä</th>
                    <th>Tila</th>
                    <th>Varaaja</th>
                    <th></th>
                </tr>
                <?php
                    $sql_select = 
                        "SELECT varaukset.id, varaukset.varauspaiva, tilat.tilan_nimi, varaajat.nimi
                        FROM varaukset
                        INNER JOIN varaajat ON varaukset.varaaja=varaajat.id
                        INNER JOIN tilat ON varaukset.tila=tilat.id
                        ORDER BY varaukset.varauspaiva ASC";
                    $query = $yhteys->prepare($sql_select);
                    $query->execute();

                    $varaukset = $query->fetchAll();

                    foreach ($varaukset as $varaus) {
                        echo "
                            <tr>
                                <td>". $varaus["varauspaiva"] ."</td>
                                <td>". $varaus["tilan_nimi"] ."</td>
                                <td>". $varaus["nimi"]."</td>
                                <td>
                                    <form method='POST' style='display:inline;'>
                                        <input type='hidden' name='id' value='". $varaus["id"] ."'/>
                                        <input type='submit' name='delete' value='Poista'/>
                                    </form>
                                </td>
                            </tr>
                        ";
                    }
                ?>
            </table>
        </section>
</html>