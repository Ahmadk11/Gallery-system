<?php

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$users_query = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
";

if ($conn->query($users_query) === TRUE) {
    echo "Users table created successfully.\n";
} else {
    echo "Error creating users table: " . $conn->error . "\n";
}

$conn->close();
?>