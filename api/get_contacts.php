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

$user_id = $_SESSION['user']['id'];
$sql = "SELECT * FROM contacts WHERE id_user=:user_id";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":user_id", $user_id);
$stmt->execute();
$contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['contacts_list' => $contacts]);