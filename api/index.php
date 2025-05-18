<?php
require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;
// Load route files
$app = AppFactory::create();
(require __DIR__ . '/routers/registers.php')($app);
(require __DIR__ . '/routers/products.php')($app);
(require __DIR__ . '/routers/branchs.php')($app);
(require __DIR__ . '/routers/receipts.php')($app);

// CORS Middleware
$app->add(function ($request, $handler) {
  $response = $handler->handle($request);
  return $response
    ->withHeader('Access-Control-Allow-Origin', '*') // or your frontend
    ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    ->withHeader("Content-Type", "application/json");
});

// Handle OPTIONS preflight
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});
$app->run();
