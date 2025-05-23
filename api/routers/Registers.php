<?php
// require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../database/connection_db.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
// use Slim\Factory\AppFactory;
// $app = AppFactory::create();
return function(App $app){

    $app->get('/api/users', function (Request $request, Response $response, $args){
        $pdo = ConnectionDB();
        if($pdo == false){
            $response->getBody()->write(json_encode(["error" => "Connection fail","status"=>400]));
            return $response->withStatus(404);
        }
        $sql = $pdo->prepare("SELECT * FROM users WHERE is_active = 1");
        $sql->execute();
        $users = $sql->fetchAll(PDO::FETCH_ASSOC);
        if ($users) {
            $response->getBody()->write(json_encode([
                "message"=>"Selected users successsfully",
                "status"=> 200,
                "data"=> $users,
            ]));
            return $response;
        } else {
            $response->getBody()->write(json_encode([
                "error" => "User not found",
                "status"=> 404
            ]));
            return $response->withStatus(404);
        }
    });
    
    $app->get('/api/users/{id}', function (Request $request, Response $response, $args) {
        $id = $args['id'];
        $pdo = ConnectionDB();
        if($pdo == false){
            $response->getBody()->write(json_encode(["error" => "Database Connection fail","status"=>400]));
            return $response->withStatus(404);
          }
        $sql = $pdo->prepare("SELECT * FROM users WHERE is_active = 1 AND id = :id");
        $sql->execute([":id" => $id]);
        $user = $sql->fetch(PDO::FETCH_ASSOC);
    
        if ($user) {
            $response->getBody()->write(json_encode([
                "message"=>"Selected user successsfully",
                "status"=> 200,
                "data"=> $user,
            ]));
            return $response;
        } else {
            $response->getBody()->write(json_encode([
                "error" => "User not found",
                "status"=> 404
            ]));
            return $response->withStatus(404);
        }
    });
    
    
    $app->post('/api/users', function(Request $request, Response $response, $args){
        $data = json_decode(file_get_contents("php://input"), true); //get data from postman json body use 'raw'
        // $data = $request->getParsedBody(); //get data from postman json body 'use www-form-urlencoded'
        // Access form-data values from Postman
        // $name = $_POST['name'] ?? 'No name provided';
        // $email = $_POST['email'] ?? 'No email provided';

    
        if (isset($data["name"], $data["password"], $data["role"], $data["status_role"])) {
            $pdo = ConnectionDB();
            if($pdo == false){
                $response->getBody()->write(json_encode(["error" => "Database Connection fail","status"=>400]));
                return $response->withStatus(404);
              }
            $sql = $pdo->prepare("INSERT INTO users (name, password, role, status_role, branch_id, created_by) VALUES (:name, :password, :role, :status_role, :branch_id, :created_by)");
            $sql->execute([
                ":name" => htmlspecialchars($data["name"]),
                ":password" => htmlspecialchars($data["password"]),
                ":role" => htmlspecialchars($data["role"]),
                ":status_role" => htmlspecialchars($data["status_role"]),
                ":branch_id" => htmlspecialchars($data["branch_id"]),
                ":created_by" => htmlspecialchars($data["created_by"]),
            ]);
    
            $response->getBody()->write(json_encode(["message" => "User register is successfully","status"=>200]));
            return $response
                ->withStatus(200);
    
        } else {
            $response->getBody()->write(json_encode(["error" => "User register is fail","status"=>400]));
            return $response
                ->withStatus(404);
        }
    });
    $app->put('/api/users/{id}', function(Request $request, Response $response, $args){
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (isset($data["name"], $data["password"], $data["role"], $data["status_role"])) {
            $pdo = ConnectionDB();
            if($pdo == false){
                $response->getBody()->write(json_encode(["error" => "Database Connection fail","status"=>400]));
                return $response->withStatus(404);
              }
            $sql = $pdo->prepare("UPDATE users  set name = :name, password = :password, role = :role, status_role = :status_role where id = :id");
            $sql->execute([
                ":id" => htmlspecialchars($args["id"]),
                ":name" => htmlspecialchars($data["name"]),
                ":password" => htmlspecialchars($data["password"]),
                ":role" => htmlspecialchars($data["role"]),
                ":status_role" => htmlspecialchars($data["status_role"])
            ]);
    
            $response->getBody()->write(json_encode(["message" => "User updated successfully","status"=>200]));
            return $response
                ->withStatus(200);
    
        } else {
            $response->getBody()->write(json_encode(["error" => "User update fail","status"=>400]));
            return $response
                ->withStatus(404);
        }
    });
    $app->delete('/api/users/{id}', function(Request $request, Response $response, $args){
        $data = json_decode(file_get_contents("php://input"), true);
    
        $pdo = ConnectionDB();
        if($pdo == false){
            $response->getBody()->write(json_encode(["error" => "Database Connection fail","status"=>400]));
            return $response->withStatus(404);
          }
        $sql = $pdo->prepare("UPDATE users  set is_active = 0 where id = :id");
        
        
        if ($sql->execute([":id" => $args["id"]])) {
            $response->getBody()->write(json_encode(["message" => "User deleted successfully","status"=>200,"User"=>$args["id"]]));
            return $response
                ->withStatus(200);
    
        } else {
            $response->getBody()->write(json_encode(["error" => "User delete fail","status"=>400]));
            return $response
                ->withStatus(404);
        }
    });
};



// $app->run();
