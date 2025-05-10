<?php
function ConnectionDB(){
  $host = "localhost";
  $dbname = "coffee_db";
  $port = 3307;
  $username = "root";
  $password = "";
  // $service = require './db.php';
  try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$dbname}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
  } catch (PDOException $e) {
    return false;
  }
}