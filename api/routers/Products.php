<?php 
// require '../vendor/autoload.php';
require_once __DIR__ .  '/../services/function.php';
require_once __DIR__ .  '/../database/connection_db.php';
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
// use Slim\Factory\AppFactory;
use Slim\App;
use Slim\Psr7\Message;

// $app = AppFactory::create();
return function(App $app){

  $app->post("/api/products", function(Request $request, Response $response, $args) {
    // $data = json_decode(file_get_contents("php://input"), true);
    $parsedBody = $request->getParsedBody();
    $uploadfile = $request->getUploadedFiles();
    $user_id = $parsedBody['user_id'] ?? null;
    $branch_id = $parsedBody['branch_id'] ?? null;
    $code = $parsedBody['code'] ?? null;
    $name = $parsedBody['name'] ?? null;
    $category = $parsedBody['category'] ?? null;
    $price = $parsedBody['price'] ?? null;
    $image = $uploadfile['image'] ?? null;

    if (!$code || !$name || !$category || !$price || !$image) {
        $response->getBody()->write(json_encode(["message" => "Missing required fields"]));
        return $response->withStatus(400);
    }
    if($uploadfile['image']->getError() !== UPLOAD_ERR_OK){
      $response->getBody()->write(json_encode(["error"=>"Updoald file fail"]));
      return $response->withStatus(400);
    }
    $directory = __DIR__ . '/../public/images';
    $filename = moveUploadedFile($directory, $image);

    if (isset($user_id, $code, $name, $category, $price, $image)) {
        $pdo = ConnectionDB();
        if($pdo == false){
          $response->getBody()->write(json_encode(["error" => "Database Connection fail"]));
          return $response->withStatus(404);
        }
        $sql = $pdo->prepare("INSERT INTO products (user_id, branch_id, code, image, name, category, unit_price) VALUES (:user_id, :branch_id, :code, :image, :name, :category, :unit_price)");
        $sql->execute([
            ":user_id" => htmlspecialchars($user_id),
            ":branch_id" => $branch_id,
            ":code" => htmlspecialchars($code),
            ":image" => $filename,
            ":name" => htmlspecialchars($name),
            ":category" => htmlspecialchars($category),
            ":unit_price" => htmlspecialchars($price)
        ]);
  
        $response->getBody()->write(json_encode(["message" => "Product added successfully"]));
        return $response->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(["message" => "Product add fail"]));
        return $response->withStatus(400);
    }
  });
  $app->post("/api/product/{id}", function(Request $request, Response $response, $args) {
    // $data = json_decode(file_get_contents("php://input"), true);
    $parsedBody = $request->getParsedBody();
    $uploadfile = $request->getUploadedFiles();
    $id = $args["id"];
    $user_id = $parsedBody['user_id'] ?? null;
    $branch_id = $parsedBody['branch_id'] ?? null;
    $code = $parsedBody['code'] ?? null;
    $name = $parsedBody['name'] ?? null;
    $category = $parsedBody['category'] ?? null;
    $price = $parsedBody['price'] ?? null;
    $image = $uploadfile['image'] ?? null;

    if (!$code || !$name || !$category || !$price) {
        $response->getBody()->write(json_encode(["message" => "Missing required fields"]));
        return $response->withStatus(400);
    }

    if(!$image){
      if (isset($user_id, $code, $name, $category, $price)) {
        $pdo = ConnectionDB();
        if($pdo == false){
          $response->getBody()->write(json_encode(["error" => "Database Connection fail"]));
          return $response->withStatus(404);
        }
        $sql = $pdo->prepare("UPDATE products SET user_id = :user_id, branch_id = :branch_id, code = :code, name = :name, category = :category, unit_price = :unit_price WHERE id = :id");
        $sql->execute([
            ":id"=>$id,
            ":user_id" => htmlspecialchars($user_id),
            ":branch_id" => $branch_id,
            ":code" => htmlspecialchars($code),
            ":name" => htmlspecialchars($name),
            ":category" => htmlspecialchars($category),
            ":unit_price" => htmlspecialchars($price)
        ]);
  
        $response->getBody()->write(json_encode(["message" => "Product updated successfully"]));
        return $response->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(["message" => "Product update fail"]));
        return $response->withStatus(400);
    }
    }else{

      if($uploadfile['image']->getError() == UPLOAD_ERR_OK){
        // $response->getBody()->write(json_encode(["error"=>"Updoald file fail"]));
        // return $response->withStatus(400);
        $directory = __DIR__ . '/../public/images';
        $filename = moveUploadedFile($directory, $image);
      }
    }
    
    if (isset($user_id, $code, $name, $category, $price)) {
        $pdo = ConnectionDB();
        if($pdo == false){
          $response->getBody()->write(json_encode(["error" => "Database Connection fail"]));
          return $response->withStatus(404);
        }
        $sql = $pdo->prepare("UPDATE products SET user_id = :user_id, code = :code, image = :image, name = :name, category = :category, unit_price = :unit_price WHERE id = :id");
        $sql->execute([
            ":id"=>$id,
            ":user_id" => htmlspecialchars($user_id),
            ":code" => htmlspecialchars($code),
            ":image" => $filename,
            ":name" => htmlspecialchars($name),
            ":category" => htmlspecialchars($category),
            ":unit_price" => htmlspecialchars($price)
        ]);
  
        $response->getBody()->write(json_encode(["message" => "Product updated successfully"]));
        return $response->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(["message" => "Product update fail"]));
        return $response->withStatus(400);
    }
  });
  
  $app->get("/api/products",function(Request $request, Response $response, $args){
    $pdo = ConnectionDB();
    if($pdo == false){
      $response->getBody()->write(json_encode(["error" => "Database Connection fail"]));
      return $response->withStatus(404);
    }
    $sql = $pdo->prepare("SELECT * FROM products where is_active = 1");
    $sql->execute();
    $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    $base_url = require_once __DIR__ . '/../services/base_url.php';
    // $product_items = $data;
    if($data){
      foreach($data as $key => $value){
        if($value['image'] !== null){
          $data[$key]['image'] = $base_url['url'] . $value['image'];
        } 
      }
      $response->getBody()->write(json_encode(["message"=>"Select product successfully","status"=>200,"data"=>$data]));
      return $response->withStatus(200)->withHeader("Content-Type","application/json");
    }else{
      $response->getBody()->write(json_encode(["message"=>"Product not found"]));
      return $response->withStatus(200)->withHeader("Content-Type","application/json");
    }
  });
  $app->get("/api/products/{id}",function(Request $request, Response $response, $args){
    $pdo = ConnectionDB();
    if($pdo == false){
      $response->getBody()->write(json_encode(["error" => "Database Connection fail"]));
      return $response->withStatus(404);
    }
    $sql = $pdo->prepare("SELECT * FROM products where is_active = 1 and id = {$args['id']}");
    $sql->execute();
    $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    $base_url = require_once __DIR__ . '/../services/base_url.php';
    // $product_items = $data;
    if($data){
      foreach($data as $key => $value){
        if($value['image'] !== null){
          $data[$key]['image'] = $base_url['url'] . $value['image'];
        } 
      }
      $response->getBody()->write(json_encode(["message"=>"Select product successfully","status"=>200,"data"=>$data[0]]));
      return $response->withStatus(200)->withHeader("Content-Type","application/json");
    }else{
      $response->getBody()->write(json_encode(["message"=>"Product not found"]));
      return $response->withStatus(200)->withHeader("Content-Type","application/json");
    }
  });

  $app->delete("/api/products/{id}",function(Request $request,Response $response, $args){
    $id = $args["id"];
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("UPDATE products set is_active = 0 where id = $id");
    if($sql->execute()){
      $response->getBody()->write(json_encode(["message"=>"Product deleted successfully","status"=>200]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["message"=>"Product delete fail","status"=>400]));
      return $response->withStatus(400);
    }
  });
};

// $app->run();