<?php
include_once 'photoSkeleton.php';

class Photo extends PhotoSkeleton {
    
    public function getPhotoData($includeImageData = false) {
        $photoData = [
            "id" => $this->id,
            "user_id" => $this->user_id,
            "title" => $this->title,
            "description" => $this->description,
            "created_at" => $this->created_at
        ];
        
        if($includeImageData) {
            $photoData["image_data"] = $this->image_data;
        }
        
        return $photoData;
    }
    
    public function getAllPhotos() {

        $query = "SELECT p.id, p.user_id, p.title, p.description, p.created_at, 
                SUBSTRING(p.image_data, 1, 5000) as image_data
                FROM " . $this->table_name . " p
                ORDER BY p.created_at DESC";
    
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
    
        $photos = [];
        while($row = $result->fetch_assoc()) {
            array_push($photos, $row);
        }
    
        return $photos;
    }
    
    public function getTotalCount() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();
        return $row['total'];
    }
    
    public function getUserPhotos($userId, $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        
        $query = "SELECT id, title, description, created_at FROM " . $this->table_name . 
                 " WHERE user_id = ? ORDER BY created_at DESC LIMIT ?, ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iii", $userId, $offset, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $photos = [];
        while($row = $result->fetch_assoc()) {
            array_push($photos, $row);
        }
        
        return $photos;
    }
    
    public function isOwnedByUser($userId) {
        return $this->user_id == $userId;
    }
}
?>