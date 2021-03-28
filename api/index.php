<?php
require __DIR__ . '/vendor/autoload.php';
session_start();
$_POST = json_decode(file_get_contents("php://input"),true);

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$serverName = $_ENV['SERVER_NAME'];
$userName = $_ENV['USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$dbName = $_ENV['DB_NAME'];
try {
    $conn = new PDO("mysql:host=$serverName;dbname=$dbName", $userName, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//   echo "Connected successfully";
} catch(PDOException $e) {
//   echo "Connection failed: " . $e->getMessage();
}

$name = $_POST['name'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE name=:name";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":name", $name);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(isset($user['name'])){
    if (password_verify($password, $user['password_hash'])) {
        $_SESSION['user'] = $user;
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "The password isn't valid"]);
    }
} else {
    echo json_encode(["error" => "There is no user with such a name"]);
}
//
//echo "<pre>";
//print_r($_POST);
//echo "</pre>";
