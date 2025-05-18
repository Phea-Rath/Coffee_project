-- CREATE DATABASE IF NOT EXISTS coffeesystem_db;
-- USE coffeesystem_db;

-- Branch Table
CREATE TABLE branch (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    location VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    create_at TIMESTAMP,
    update_at TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200),
    password VARCHAR(200),
    role VARCHAR(200),
    status_role INT(11),
    branch_id INT(50),
    created_by INT(50),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- Sales Table
CREATE TABLE sales (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11),
    sale_date TIMESTAMP,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Receipts Table
CREATE TABLE receipts (
    id INT(100) PRIMARY KEY AUTO_INCREMENT,
    sale_id INT(100),
    branch_id INT(100),
    unit_total DECIMAL(10,2),
    discount DECIMAL(3,2),
    tax DECIMAL(3,2),
    currency VARCHAR(10),
    total DECIMAL(10,2),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- Products Table
CREATE TABLE products (
    id INT(100) PRIMARY KEY AUTO_INCREMENT,
    user_id INT(100),
    branch_id INT(100),
    code VARCHAR(100),
    image VARCHAR(500),
    name VARCHAR(200),
    category VARCHAR(250),
    unit_price DECIMAL(10,2),
    is_active  TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- Sales Detail Table
CREATE TABLE sales_detail (
    id INT(100) PRIMARY KEY AUTO_INCREMENT,
    sale_id INT(100),
    product_id INT(100),
    receipt_id INT(100),
    qty INT(100),
    unit_price DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (receipt_id) REFERENCES receipts(id)
);
