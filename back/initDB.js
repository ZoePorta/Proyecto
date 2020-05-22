require("dotenv").config();

const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const bcrypt = require("bcrypt");

const faker = require("faker/locale/es");
const { random, shuffle, sample, sampleSize } = require("lodash");

const addData = process.argv[2] === "--data";

async function main() {
  //Get reference to DB
  const connection = await getConnection();

  console.log("Dropping tables");
  await connection.query("DROP TABLE IF EXISTS ratings");
  await connection.query("DROP TABLE IF EXISTS wishlist");
  await connection.query("DROP TABLE IF EXISTS orders_products");
  await connection.query("DROP TABLE IF EXISTS orders");
  await connection.query("DROP TABLE IF EXISTS photos");
  await connection.query("DROP TABLE IF EXISTS products");
  await connection.query("DROP TABLE IF EXISTS shops");
  await connection.query("DROP TABLE IF EXISTS adresses");
  await connection.query("DROP TABLE IF EXISTS users");

  //Create tables
  await connection.query(`
  CREATE TABLE users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL UNIQUE,
  photo VARCHAR(255),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  password VARCHAR(255),
  last_password_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  birth_date DATE,
  role ENUM('regular', 'vendor', 'admin') DEFAULT 'regular' NOT NULL,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT false NOT NULL,
  registration_code VARCHAR(255)
  );
  `);

  await connection.query(`
  CREATE TABLE adresses (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED,
name VARCHAR(255),
row1 VARCHAR(255),
row2 VARCHAR(255),
city VARCHAR(255),
PC MEDIUMINT,
country VARCHAR(100),
prefix VARCHAR(4),
tlf INT,
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_adresses_users FOREIGN KEY (users_id) REFERENCES users(id)
);
  `);

  await connection.query(`
  CREATE TABLE shops (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED UNIQUE,
name VARCHAR(100),
description TEXT(500),
video VARCHAR(255),
twitter VARCHAR(255),
instagram VARCHAR(255),
facebook VARCHAR(255),
promoted BOOLEAN DEFAULT false,
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_shops_users FOREIGN KEY (users_id) REFERENCES users(id)
);
  `);

  await connection.query(`
  CREATE TABLE products (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
shops_id INT UNSIGNED,
category VARCHAR(50),
name VARCHAR(100),
price DECIMAL(7,2),
stock SMALLINT,
availability ENUM ('not_available', 'available', 'custom') NOT NULL DEFAULT 'not_available',
description TEXT(500),
color VARCHAR(255),
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_products_shops FOREIGN KEY (shops_id) REFERENCES shops(id)
);
  `);

  await connection.query(`
  CREATE TABLE photos (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
products_id INT UNSIGNED,
path VARCHAR(255),
CONSTRAINT FK_photos_products FOREIGN KEY (products_id) REFERENCES products(id)
);
  `);

  await connection.query(`
  CREATE TABLE orders (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED,
finished BOOLEAN,
sell_date DATETIME,
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME,
CONSTRAINT FK_oreders_users foreign key (users_id) REFERENCES users(id)
);
  `);

  await connection.query(`
  CREATE TABLE orders_products (
id INT PRIMARY KEY AUTO_INCREMENT,
orders_id INT UNSIGNED,
products_id INT UNSIGNED,
price DECIMAL(7,2),
quantity SMALLINT,
CONSTRAINT FK_oreders_products_orders FOREIGN KEY (orders_id) REFERENCES orders(id),
CONSTRAINT FK_orders_products_products FOREIGN KEY (products_id) REFERENCES products(id)
);
  `);

  await connection.query(`
  CREATE TABLE wishlist (
id INT PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED,
products_id INT UNSIGNED,
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_wishlist_users FOREIGN KEY (users_id) REFERENCES users(id),
CONSTRAINT FK_wishlist_products FOREIGN KEY (products_id) REFERENCES products(id)
);

  `);

  await connection.query(`
  CREATE TABLE ratings (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED,
products_id INT UNSIGNED,
rating DECIMAL (2,1),
comment VARCHAR(255),
CONSTRAINT FK_ratings_users FOREIGN KEY (users_id) REFERENCES users(id),
CONSTRAINT FK_rating_products FOREIGN KEY (products_id) REFERENCES products(id)
);

  `);

  //Create initial admin
  const password = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

  await connection.query(`
  INSERT INTO users(email, password, role, active)
  VALUES('admin@admin.com', '${password}', 'admin', 1 )
  `);

  ////Tu add example data use 'initDB --data'
  if (addData) {
    //Users
    const users = 10;

    for (let i = 0; i < users; i++) {
      const password = await bcrypt.hash(faker.internet.password(), 10);
      const birthDate = formatDateToDB(faker.date.past());

      await connection.query(`
  INSERT INTO users(email, password, active, first_name, last_name, photo, birth_date)
  VALUES('${faker.internet.email()}', '${password}', 1, '${faker.name.firstName()}', '${faker.name.lastName()}', '${faker.internet.avatar()}', '${birthDate}')
  `);
    }

    //Shops
    const shops = users / 2;
    const randomUserIds = shuffle([...Array(10).keys()]);

    for (let i = 0; i < shops; i++) {
      const userId = randomUserIds[i] + 2;

      await connection.query(`
      INSERT INTO shops(users_id, name, description)
      VALUES('${userId}', '${faker.lorem.words(
        random(1, 3)
      )}', '${faker.lorem.paragraph()}')
      `);

      await connection.query(`
          UPDATE users SET role = 'vendor' WHERE id = ${userId}
          `);
    }

    //Productos
    const products = 100;

    const categories = [
      "supplies",
      "headwear",
      "clothing",
      "decor",
      "jewerly",
      "accesories",
      "bags",
    ];
    const colors = [
      "black",
      "white",
      "gray",
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "brown",
      "pink",
    ];

    for (let i = 0; i < products; i++) {
      const stock = sample([0, random(1, 5), random(6, 50), random(51, 500)]);
      const availability = stock
        ? sample(["available", "custom"])
        : "not_available";
      await connection.query(`
      INSERT INTO products(shops_id, category, name, price, stock, availability, description, color)
      VALUES ('${random(1, shops)}', '${sample(
        categories
      )}', '${faker.lorem.words(random(1, 5))}', '${random(1000, true).toFixed(
        2
      )}', '${stock}', '${availability}', '${faker.lorem.paragraph()}', '${sampleSize(
        colors,
        random(1, 6)
      )}')
      `);
    }

    console.log("Example data added");
  }

  console.log("Initial structure created");

  connection.release();
  process.exit();
}

main();
