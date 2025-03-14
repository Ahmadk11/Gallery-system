<?php
class PhotoSkeleton {

    private $conn;
    private $table_name = "photos";

    public $id;
    public $user_id;
    public $title;
    public $description;
    public $image_data;
    public $created_at;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function readAll() {
        $query = "SELECT id, user_id, title, description, created_at FROM " . $this->table_name . " ORDER BY created_at DESC";
        $result = $this->conn->query($query);
        return $result;
    }
    
    public function readUserPhotos() {
        $query = "SELECT id, title, description, created_at FROM " . $this->table_name . " WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        return $stmt->get_result();
    }
    
    public function readOne() {
        $query = "SELECT id, user_id, title, description, image_data, created_at FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $this->user_id = $row['user_id'];
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->image_data = $row['image_data'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET user_id = ?, title = ?, description = ?, image_data = ?";
        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));

        $stmt->bind_param("isss", $this->user_id, $this->title, $this->description, $this->image_data);
        if($stmt->execute()) {
            $this->id = $this->conn->insert_id;
            return true;
        }
        return false;
    }
    
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET title = ?, description = ? WHERE id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($query);
        
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $stmt->bind_param("ssii", $this->title, $this->description, $this->id, $this->user_id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    public function updateImage() {
        $query = "UPDATE " . $this->table_name . " SET image_data = ? WHERE id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sii", $this->image_data, $this->id, $this->user_id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $this->id, $this->user_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>