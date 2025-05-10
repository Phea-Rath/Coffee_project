<?php 
require_once '../Database/connection_db.php';
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\App;

return function (App $app) {
  $app->post("/api/receipts",function(Request $request,Response $response,$args){
    // $data = $request->getParsedBody();
    $data = json_decode(file_get_contents("php://input"),true);
    $user_id = $data["user_id"]??null;
    $unit_total = $data["unit_total"]??null;
    $discount = $data["discount"]??null;
    $tax = $data["tax"]??null;
    $currency = $data["currency"]??null;
    $total = $data["total_receipt"]??null;
    $sale_detail = $data["sale_detail"]??null;

    if(isset($user_id,$unit_total,$discount,$tax,$currency,$total)){
      $pdo = ConnectionDB();
      $sql = $pdo->prepare("INSERT INTO sales (user_id,total_amount) VALUES (:user_id,:total_amount)");
      if($sql->execute([
        ":user_id"=>$user_id,
        ":total_amount"=>$total,
      ])){
        $sql = $pdo->prepare("SELECT id FROM sales ORDER BY id DESC LIMIT 1");
        $sql->execute();
        $sale_id = $sql->fetch(PDO::FETCH_ASSOC)['id'];
        // $response->getBody()->write(json_encode(["id"=>$sale_id]));
        // return $response->withStatus(200);
        if($sale_id){
          $sql = $pdo->prepare("INSERT INTO receipts (sale_id,unit_total,discount,tax,currency,total) VALUES (:sale_id,:unit_total,:discount,:tax,:currency,:total)");
          if($sql->execute([
            ":sale_id" => (int)$sale_id,
            ":unit_total" => $unit_total,
            ":discount" => $discount,
            ":tax" => $tax,
            ":currency" => $currency,
            "total" => $total
          ])){
              $sql = $pdo->prepare("SELECT id FROM receipts ORDER BY id DESC LIMIT 1");
              $sql->execute();
              $receipt_id = $sql->fetch(PDO::FETCH_ASSOC)['id'];
              // $response->getBody()->write(json_encode(["id"=>$receipt_id]));
              // return $response->withStatus(200);
              if($receipt_id){
                $sql = $pdo->prepare("INSERT INTO sales_detail (sale_id,product_id,receipt_id,qty,unit_price,total) VALUES (:sale_id,:product_id,:receipt_id,:qty,:unit_price,:total)");
                try {
                  foreach ($sale_detail as $value) {
                      $sql->execute([
                          ":sale_id" => (int)$sale_id,
                          ":product_id" => $value['product_id'],
                          ":receipt_id" => (int)$receipt_id,
                          ":qty" => $value['qty'],
                          ":unit_price" => $value['unit_price'],
                          ":total" => (int)$value['qty'] * (double)$value['unit_price'],
                      ]);
                  }
                } catch (PDOException $e) {
                  $response->getBody()->write(json_encode(["error"=>$e->getMessage()]));
                  return $response->withStatus(200);
                }
                $response->getBody()->write(json_encode(["message"=>"Receipt added successfully"]));
                return $response->withStatus(200);
              }else{
                $response->getBody()->write(json_encode(["error"=>"Missing sale_detail request"]));
                return $response->withStatus(400);
              }
            }else{
              $response->getBody()->write(json_encode(["error"=>"Missing receipt request"]));
              return $response->withStatus(400);
            }
          }
      }
    }else{
      $response->getBody()->write(json_encode(["error"=>"Missing sale request","data"=>$data]));
      return $response->withStatus(400);
    }
  });

  $app->get("/api/receipts",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("SELECT * FROM receipts");
    $sql->execute();
    $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    if($data){
      $response->getBody()->write(json_encode(["message"=>"Receipt selected successfully","status"=>200,"data"=>$data]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["error"=>"Receipt selected faill","status"=>400]));
      return $response->withStatus(400);
    }
  });
};