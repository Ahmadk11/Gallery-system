<?php
class Validator {

    public static function validateRegistration($data) {
        $errors = [];
        
        if(empty($data['username'])) {
            $errors['username'] = "Username is required";
        }
        
        if(empty($data['email'])) {
            $errors['email'] = "Email is required";
        }
        
        if(empty($data['password'])) {
            $errors['password'] = "Password is required";
        }
        
        if(empty($data['confirm_password'])) {
            $errors['confirm_password'] = "Please confirm your password";
        } elseif($data['password'] !== $data['confirm_password']) {
            $errors['confirm_password'] = "Passwords do not match";
        }
        
        return $errors;
    }
    
    public static function validateLogin($data) {
        $errors = [];
        
        if(empty($data['email'])) {
            $errors['email'] = "Email is required";
        }
        
        if(empty($data['password'])) {
            $errors['password'] = "Password is required";
        }
        
        return $errors;
    }
}
?>