CREATE DATABASE IF NOT EXISTS coffeesystem_db;
USE coffeesystem_db;

-- Branch Table
CREATE TABLE branch (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250) NOT NULL,
    location VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO branch(name,location) VALUES('coffee','Phnom Penh');

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(200),
    status_role INT,
    branch_id INT,
    created_by INT,
    is_active TINYINT(1) DEFAULT 1,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branch(id)
    -- You can add: FOREIGN KEY (created_by) REFERENCES users(id) after first insert
);

-- Insert Admin User (must run after branches exist if FK is added)
INSERT INTO users(name, password, role, status_role, branch_id, created_by)
VALUES ('Admin', '123', 'admin', 1, 1, 1);

-- Sales Table
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Receipts Table
CREATE TABLE receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT,
    branch_id INT,
    unit_total DECIMAL(10,2),
    discount DECIMAL(5,2),
    tax DECIMAL(5,2),
    currency VARCHAR(10),
    total DECIMAL(10,2),
    is_active TINYINT(1) DEFAULT 1,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    branch_id INT,
    code VARCHAR(100),
    image VARCHAR(500),
    name VARCHAR(200),
    category VARCHAR(250),
    unit_price DECIMAL(10,2),
    is_active TINYINT(1) DEFAULT 1,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- Sales Detail Table
CREATE TABLE sales_detail (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT,
    product_id INT,
    receipt_id INT,
    qty INT,
    unit_price DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (receipt_id) REFERENCES receipts(id)
);
