<?php 
require_once __DIR__ . '/../database/connection_db.php';
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\App;

return function (App $app) {
  $app->post("/api/receipts",function(Request $request,Response $response,$args){
    // $data = $request->getParsedBody();
    $data = json_decode(file_get_contents("php://input"),true);
    $user_id = $data["user_id"]??null;
    $branch_id = $data["branch_id"]??null;
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
          $sql = $pdo->prepare("INSERT INTO receipts (sale_id,branch_id,unit_total,discount,tax,currency,total) VALUES (:sale_id,:branch_id,:unit_total,:discount,:tax,:currency,:total)");
          
          if($sql->execute([
            ":sale_id" => (int)$sale_id,
            ":branch_id" => $branch_id,
            ":unit_total" => $unit_total,
            ":discount" => $discount,
            ":tax" => $tax,
            ":currency" => $currency,
            ":total" => $total
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
                          ":product_id" => $value['id'],
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

  $app->get("/api/receipts_detail",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("SELECT 
          r.id AS receipt_id,
          r.branch_id,
          b.name AS branch_name,
          s.id AS sale_id,
          s.sale_date,
          r.unit_total,
          r.discount,
          r.tax,
          r.currency,
          r.total AS receipt_total,
          sd.id AS sales_detail_id,
          sd.qty,
          sd.total AS detail_total,
          p.id AS product_id,
          p.name AS product_name,
          p.unit_price AS product_unit_price
      FROM sales s
      INNER JOIN receipts r ON s.id = r.sale_id
      INNER JOIN branch b ON r.branch_id = b.id
      INNER JOIN sales_detail sd ON s.id = sd.sale_id
      INNER JOIN products p ON sd.product_id = p.id where r.is_active = 1;
    ");
    $sql->execute();
    $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    if($data){
      $response->getBody()->write(json_encode(["message"=>"Receipt_detail selected successfully","status"=>200,"data"=>$data]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["error"=>"Receipt_detail selected faill","status"=>400]));
      return $response->withStatus(400);
    }
  });

  $app->get("/api/receipts_detail/{id}",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("SELECT 
          r.id AS receipt_id,
          s.id AS sale_id,
          r.branch_id,
          b.name AS branch_name,
          s.sale_date,
          r.unit_total,
          r.discount,
          r.tax,
          r.currency,
          r.total AS receipt_total,
          sd.id AS sales_detail_id,
          sd.qty,
          sd.total AS detail_total,
          p.id AS product_id,
          p.name AS product_name,
          p.unit_price AS product_unit_price
      FROM sales s
      INNER JOIN receipts r ON s.id = r.sale_id
      INNER JOIN branch b ON r.branch_id = b.id
      INNER JOIN sales_detail sd ON s.id = sd.sale_id
      INNER JOIN products p ON sd.product_id = p.id WHERE r.id = {$args['id']} and r.is_active = 1;
    ");
    $sql->execute();
    $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    $proItem = [];
    foreach($data as $key => $value){
      array_push($proItem,["id"=>$data[$key]["product_id"],"name"=>$data[$key]["product_name"],"qty"=>$data[$key]["qty"],"unit_price"=>$data[$key]["product_unit_price"],"total"=>$data[$key]["detail_total"]]);
    }
    $format = [
      "receipt_id"=> $data[0]["receipt_id"],
      "sale_id"=> $data[0]["sale_id"],
      "branch_id"=> $data[0]["branch_id"],
      "branch_name"=> $data[0]["branch_name"],
      "sale_date"=> $data[0]["sale_date"],
      "unit_total"=> $data[0]["unit_total"],
      "discount"=> $data[0]["discount"],
      "tax"=> $data[0]["tax"],
      "currency"=> $data[0]["currency"],
      "receipt_total"=> $data[0]["receipt_total"],
      "products"=>$proItem
    ];
    if($data){
      $response->getBody()->write(json_encode(["message"=>"Receipt_detail selected successfully","status"=>200,"data"=>$format]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["error"=>"Receipt_detail selected faill","status"=>400]));
      return $response->withStatus(400);
    }
  });
  $app->get("/api/receipts/{id}",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("SELECT * FROM  receipts  WHERE id = {$args['id']} and is_active = 1;
    ");
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
  $app->get("/api/receipts",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("SELECT * FROM  receipts where is_active = 1;
    ");
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
  
  $app->delete("/api/receipts/{id}",function(Request $request,Response $response,$args){
    $pdo = ConnectionDB();
    $sql = $pdo->prepare("UPDATE receipts SET is_active = 0  where id IN ({$args['id']})");
    if($sql->execute()){
      $response->getBody()->write(json_encode(["message"=>"Receipt deleted successfully","status"=>200]));
      return $response->withStatus(200);
    }else{
      $response->getBody()->write(json_encode(["error"=>"Receipt deleted faill","status"=>400]));
      return $response->withStatus(400);
    }
  });
};