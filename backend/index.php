<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$request_uri = $_SERVER['REQUEST_URI'];
$url_parts = parse_url($request_uri);
$path = $url_parts['path'];


$base_path = '/gallery_system/backend/';
$api_path = str_replace($base_path, '', $path);

$api_endpoints = [
    'users/register' => ['controller' => 'AuthController', 'method' => 'register'],
    'users/login' => ['controller' => 'AuthController', 'method' => 'login'],
    'users/logout' => ['controller' => 'AuthController', 'method' => 'logout'],
    'users/profile' => ['controller' => 'UserController', 'method' => 'getProfile'],
    'users/update' => ['controller' => 'UserController', 'method' => 'updateProfile'],
    'photos' => ['controller' => 'PhotoController', 'method' => 'getAll'],
    'photos/upload' => ['controller' => 'PhotoController', 'method' => 'upload'],
    'photos/details' => ['controller' => 'PhotoController', 'method' => 'getOne'],
    'photos/update' => ['controller' => 'PhotoController', 'method' => 'update'],
    'photos/delete' => ['controller' => 'PhotoController', 'method' => 'delete']
];

if (array_key_exists($api_path, $api_endpoints)) {
    $controller_name = $api_endpoints[$api_path]['controller'];
    $method_name = $api_endpoints[$api_path]['method'];
    
    include_once 'controllers/' . $controller_name . '.php';
    
    $controller = new $controller_name();
    
    $controller->$method_name();
} else {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint not found"]);
}
?>