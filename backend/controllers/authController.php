<?php
include_once 'config/database.php';
include_once 'models/user.php';
include_once 'utils/response.php';
include_once 'utils/validator.php';

class AuthController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    private function generateToken($userId) {
        $payload = [
            'user_id' => $userId,
            'exp' => time() + 3600
        ];
        return base64_encode(json_encode($payload));
    }
    
    public function register() {
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        $errors = Validator::validateRegistration($data);
        
        if(!empty($errors)) {
            Response::error($errors, 400);
            return;
        }
        
        $user = new User($this->db);
        $user->email = $data['email'];
        $user->username = $data['username'];
        
        if($user->emailExists()) {
            Response::error("Email already exists", 400);
            return;
        }
        
        if($user->usernameExists()) {
            Response::error("Username already exists", 400);
            return;
        }
        
        if($user->register($data['username'], $data['email'], $data['password'])) {
            $token = $this->generateToken($user->id);
            Response::success(
                ["user" => $user->getUserData(), "token" => $token],
                "User registered successfully",
                201
            );
        } else {
            Response::error("Unable to register user", 500);
        }
    }
    
    public function login() {
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error("Invalid request method", 405);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        $errors = Validator::validateLogin($data);
        
        if(!empty($errors)) {
            Response::error($errors, 400);
            return;
        }
        
        $user = new User($this->db);
        
        if($user->login($data['email'], $data['password'])) {
            $token = $this->generateToken($user->id);
            Response::success(
                ["user" => $user->getUserData(), "token" => $token],
                "Login successful"
            );
        } else {
            Response::error("Invalid email or password", 401);
        }
    }
    
    public function logout() {
        Response::success(null, "Logout successful");
    }
    
    public function checkAuth() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::error("Authentication token not found", 401);
            return;
        }
        
        $token = $matches[1];
        $payload = json_decode(base64_decode($token), true);
        
        if (!isset($payload['exp']) || $payload['exp'] < time()) {
            Response::error("Token has expired", 401);
            return;
        }
        
        $user = new User($this->db);
        $user->id = $payload['user_id'];
        
        if ($user->readOne()) {
            Response::success(["user" => $user->getUserData()], "User is authenticated");
        } else {
            Response::error("Invalid user", 401);
        }
    }
}
?>