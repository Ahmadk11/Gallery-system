<?php
include_once 'config/database.php';
include_once 'models/photo.php';
include_once 'utils/response.php';
include_once 'utils/fileHandler.php';

class PhotoController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    private function getUserIdFromToken() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return false;
        }
        
        $payload = json_decode(base64_decode($matches[1]), true);
        
        if (!isset($payload['exp']) || $payload['exp'] < time()) {
            return false;
        }
        
        return $payload['user_id'];
    }
    
    public function upload() {
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $userId = $this->getUserIdFromToken();
        if(!$userId) {
            Response::error("Unauthorized", 401);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(empty($data['title']) || empty($data['image_data'])) {
            Response::error("Title and image are required", 400);
            return;
        }
        
        $base64Image = FileHandler::processBase64Image($data['image_data']);
        if(!$base64Image) {
            Response::error("Invalid image format", 400);
            return;
        }
        
        $photo = new Photo($this->db);
        $photo->user_id = $userId;
        $photo->title = $data['title'];
        $photo->description = isset($data['description']) ? $data['description'] : '';
        $photo->image_data = $base64Image;
        
        if($photo->create()) {
            Response::success(
                ["photo" => $photo->getPhotoData()],
                "Photo uploaded successfully",
                201
            );
        } else {
            Response::error("Unable to upload photo", 500);
        }
    }
    
    public function getAll() {
        if($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $photo = new Photo($this->db);
        $photos = $photo->getAllPhotos();
        
        Response::success([
            "photos" => $photos
        ]);
    }
    
    public function getOne() {
        if($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $photoId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if(!$photoId) {
            Response::error("Photo ID is required", 400);
            return;
        }
        
        $photo = new Photo($this->db);
        $photo->id = $photoId;
        
        if($photo->readOne()) {
            Response::success(["photo" => $photo->getPhotoData(true)]);
        } else {
            Response::error("Photo not found", 404);
        }
    }
    
    public function update() {
        if($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $userId = $this->getUserIdFromToken();
        if(!$userId) {
            Response::error("Unauthorized", 401);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(empty($data['id']) || empty($data['title'])) {
            Response::error("Photo ID and title are required", 400);
            return;
        }
        
        $photo = new Photo($this->db);
        $photo->id = $data['id'];
        
        if(!$photo->readOne()) {
            Response::error("Photo not found", 404);
            return;
        }
        
        if(!$photo->isOwnedByUser($userId)) {
            Response::error("You don't have permission to update this photo", 403);
            return;
        }
        
        $photo->title = $data['title'];
        $photo->description = isset($data['description']) ? $data['description'] : '';
        
        if($photo->update()) {
            if(!empty($data['image_data'])) {
                $base64Image = FileHandler::processBase64Image($data['image_data']);
                if($base64Image) {
                    $photo->image_data = $base64Image;
                    $photo->updateImage();
                }
            }
            
            Response::success(
                ["photo" => $photo->getPhotoData()],
                "Photo updated successfully"
            );
        } else {
            Response::error("Unable to update photo", 500);
        }
    }
    
    public function delete() {
        if($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $userId = $this->getUserIdFromToken();
        if(!$userId) {
            Response::error("Unauthorized", 401);
            return;
        }
        
        $photoId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if(!$photoId) {
            Response::error("Photo ID is required", 400);
            return;
        }
        
        $photo = new Photo($this->db);
        $photo->id = $photoId;
        
        if(!$photo->readOne()) {
            Response::error("Photo not found", 404);
            return;
        }
        
        if(!$photo->isOwnedByUser($userId)) {
            Response::error("You don't have permission to delete this photo", 403);
            return;
        }
        
        if($photo->delete()) {
            Response::success(null, "Photo deleted successfully");
        } else {
            Response::error("Unable to delete photo", 500);
        }
    }
}
?>