<?php

$pdo = new PDO('mysql:host=localhost;dbname=signatures;charset=utf8mb4', 'app', 'app');

$query = isset($_GET['q']) ? $_GET['q'] : '';
$role  = isset($_GET['role']) ? $_GET['role'] : 'user';

$sql = "SELECT id, name, email FROM users WHERE name LIKE '%" . $query . "%' AND role = '" . $role . "'";

$result = $pdo->query($sql);
$rows = $result->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($rows);
