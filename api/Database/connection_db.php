<?php
function ConnectionDB(){
  $host = "localhost";
  $dbname = "coffeesystem_db";
  $port = 3307;
  $username = "root";
  $password = "";
//  
    // $host = "sql101.infinityfree.com";
    // $dbname = "if0_39007545_coffeesystem_db";
    // $port = 3306;
    // $username = "if0_39007545";
    // $password = "cNHs2cSSCfriFEE";

    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        $conn = new PDO($dsn, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        // You can log the error if needed: error_log($e->getMessage());
        return false;
    }
}