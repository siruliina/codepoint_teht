<?php 
    $host= "localhost"; 
    $username = "root"; 
    $database = "tilavaraus"; 
    $password = null; 

    try { 
        $yhteys = new PDO("mysql:host=$host;dbname=$database", $username, $password); 
        $yhteys->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    } 
    catch(PDOException $e){ echo "<p>".$e->getMessage()."<p>"; }     
?>