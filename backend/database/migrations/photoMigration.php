<?php

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$photos_query = "
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NULL,
    image_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
";

if ($conn->query($photos_query) === TRUE) {
    echo "Photos table created successfully.\n";
} else {
    echo "Error creating photos table: " . $conn->error . "\n";
}

$conn->close();
?>