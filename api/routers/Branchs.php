<?php
require_once '../Services/Function.php';
require_once '../Database/connection_db.php';
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
// use Slim\Factory\AppFactory;
use Slim\App;

return function(App $app){
  $app->post('/api/branchs',function(Request $request,Response $response,$args){
    $data = $request->getParsedBody();

    $name = $data['name']?? null;
    $location = $data['location']??null;
    if($name&&$location){
      $pdo = ConnectionDB();
      $sql = $pdo->prepare('INSERT INTO branch(name, location) VALUES (:name, :location)');
      $sql->execute([
        ":name"=>$name,
        ":location"=>$location
      ]);
      $response->getBody()->write(json_encode(["message"=>"Branch added successfully"]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["error"=>"Missing request"]));
      return $response->withStatus(400);
    }
  });

  $app->get("/api/branchs",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("SELECT * FROM branch where is_active = 1");
    $sql->execute();
    $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    if($data){
      $response->getBody()->write(json_encode(["message"=>"Branch selected successfully","status"=>200,"data"=>$data]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["message"=>"Branch not found"]));
      return $response->withStatus(400);

    }
  });
  $app->delete("/api/branchs/{id}",function(Request $request,Response $response, $args){
    $id = $args["id"];
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("UPDATE branch set is_active = 0 where id = $id");
    if($sql->execute()){
      $response->getBody()->write(json_encode(["message"=>"Branch deleted successfully","status"=>200]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["message"=>"Branch delete fail","status"=>400]));
      return $response->withStatus(400);
    }
  });
};
