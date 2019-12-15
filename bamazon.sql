DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT(4) NOT NULL,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price decimal(10,2) NULL,
  stock_quantity int(20) NULL,
  PRIMARY KEY (item_id)
);

Select * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
(253, "Cellular Charger", "Eletronics", 22.35,15),
(157, "Philips Norelco", "Beauty", 109.95,25),
(015, "Woojer Vest Pro", "Video Games", 639.25,5),
(018, "CevaPro Gloves", "Fashion", 19.95,75),
(258, "SteelBee Razor Saver", "Beauty", 12.99,15),
(987, "Le Creuset", "Home", 79.95,42),
(547, "Instant Pot Duo", "Kitchen", 59.95,8),
(026, "Epson T288120-s", "Office", 8.69,167),
(033, "Annke Cable", "Eletronics", 29.99,12),
(078, "Echo Show 5", "Amazon Devices", 59.99,37),