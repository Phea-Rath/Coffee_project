Create database coffee_db;

use CoffeeManagement_db;

Create Table users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(200) NOT NULL,
  status_role INT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

Create TABLE products(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(250) NOT NULL,
  qty INT,
  unitprice DECIMAL(10,2),
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2)
);

CREATE TABLE receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT UNIQUE,
  unit_total DECIMAL(10,2),
  discount DECIMAL(3,2),
  tax DECIMAL(3,2),
  currency VARCHAR(10),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE TABLE sales_detail (
    sale_id INT,
    product_id INT,
    receipt_id INT,
    qty INT,
    unitprice DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (receipt_id) REFERENCES receipts(id),
    PRIMARY KEY(sale_id, product_id, receipt_id)
);