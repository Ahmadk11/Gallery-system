<?php
include_once 'userSkeleton.php';

class User extends UserSkeleton {
    
    public function register($username, $email, $password) {
        $this->username = $username;
        $this->email = $email;
        
        $this->password = password_hash($password, PASSWORD_BCRYPT);
        
        return $this->create();
    }
    
    public function login($email, $password) {
        $this->email = $email;
        
        if($this->readByEmail()) {
            if(password_verify($password, $this->password)) {
                return true;
            }
        }
        return false;
    }
    
    public function getUserData() {
        return [
            "id" => $this->id,
            "username" => $this->username,
            "email" => $this->email
        ];
    }
}
?>