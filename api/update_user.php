<?php
require __DIR__ . '/vendor/autoload.php';
session_start();
if (!isset($_SESSION['user'])){
    echo json_encode(["error" => "No user connected"]);
    exit;
}
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

$email = $_POST['email'];
$last_name = $_POST['last_name'];
$name = $_POST['name'];
$company_name = $_POST['company_name'];
$phone = $_POST['phone'];

$sql = "UPDATE users SET email=:email, name=:name, company_name=:company_name, phone=:phone WHERE name=:last_name";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":last_name", $last_name);
$stmt->bindParam(":email", $email);
$stmt->bindParam(":name", $name);
$stmt->bindParam(":company_name", $company_name);
$stmt->bindParam(":phone", $phone);
$stmt->execute();
$result = $stmt->rowCount();

$sql = "SELECT * FROM users WHERE name=:name";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":name", $name);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$_SESSION['user'] = $user;

echo $result;