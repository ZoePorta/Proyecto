require("dotenv").config();

const { getConnection } = require("./db");
const { formatDateToDB, categories, colors } = require("./helpers");
const bcrypt = require("bcrypt");

const faker = require("faker/locale/es");
const { random, shuffle, sample, sampleSize } = require("lodash");

const addData = process.argv[2] === "--data";

async function main() {
  //Get reference to DB
  const connection = await getConnection();

  console.log("Dropping tables");
  await connection.query("DROP TABLE IF EXISTS orders_products");
  await connection.query("DROP TABLE IF EXISTS wishlists");
  await connection.query("DROP TABLE IF EXISTS ratings");
  await connection.query("DROP TABLE IF EXISTS orders");
  //await connection.query("DROP TABLE IF EXISTS photos");
  await connection.query("DROP TABLE IF EXISTS products");
  await connection.query("DROP TABLE IF EXISTS shops");
  await connection.query("DROP TABLE IF EXISTS addresses");
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
  forced_expiration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  birth_date DATE,
  role ENUM('regular', 'vendor', 'admin') DEFAULT 'regular' NOT NULL,
  creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT false NOT NULL,
  verification_code VARCHAR(255)
  );
  `);

  await connection.query(`
  CREATE TABLE addresses (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED,
alias VARCHAR(255),
name VARCHAR(255),
row1 VARCHAR(255),
row2 VARCHAR(255),
city VARCHAR(255),
PC BIGINT UNSIGNED,
country VARCHAR(100),
prefix VARCHAR(6),
phone_number BIGINT UNSIGNED,
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_addresses_users FOREIGN KEY (users_id) REFERENCES users(id)
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
photo VARCHAR(255),
name VARCHAR(100),
price DECIMAL(7,2),
stock SMALLINT,
available BOOLEAN DEFAULT false,
type ENUM ('ready', 'custom') NOT NULL DEFAULT 'ready',
description TEXT(500),
color VARCHAR(255),
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_products_shops FOREIGN KEY (shops_id) REFERENCES shops(id)
);
  `);

  //Multiple photos per product not implemented yet
  /*   await connection.query(`
  CREATE TABLE photos (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
products_id INT UNSIGNED,
path VARCHAR(255),
CONSTRAINT FK_photos_products FOREIGN KEY (products_id) REFERENCES products(id)
);
  `); */

  await connection.query(`
  CREATE TABLE orders (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
users_id INT UNSIGNED,
addresses_id INT UNSIGNED,
finished BOOLEAN DEFAULT FALSE,
sell_date DATETIME,
creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
mod_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT FK_oreders_users FOREIGN KEY (users_id) REFERENCES users(id),
CONSTRAINT FK_oreders_addresses FOREIGN KEY (addresses_id) REFERENCES addresses(id)
);
  `);

  await connection.query(`
  CREATE TABLE orders_products (
id INT PRIMARY KEY AUTO_INCREMENT,
orders_id INT UNSIGNED,
products_id INT UNSIGNED,
price DECIMAL(7,2),
quantity SMALLINT DEFAULT 1,
CONSTRAINT FK_oreders_products_orders FOREIGN KEY (orders_id) REFERENCES orders(id),
CONSTRAINT FK_orders_products_products FOREIGN KEY (products_id) REFERENCES products(id)
);
  `);

  await connection.query(`
  CREATE TABLE wishlists (
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
    //Example user => email: user@user.com, password: password
    const password = await bcrypt.hash("password", 10);
    const birthDate = formatDateToDB(faker.date.past());

    await connection.query(`
  INSERT INTO users(email, password, active, first_name, last_name, photo, birth_date)
  VALUES('user@user.com', '${password}', 1, '${faker.name.firstName()}', '${faker.name.lastName()}', '${faker.internet.avatar()}', '${birthDate}')
  `);

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

    //Addresses
    const extraAddresses = 10;
    //Main address per user
    for (let i = 0; i <= users; i++) {
      await connection.query(`
      INSERT INTO addresses(users_id, alias, name, row1, row2, city, PC, country, prefix, phone_number)
      VALUES ('${i + 2}', '${faker.lorem.words(
        2
      )}', '${faker.name.findName()}', '${faker.address.streetAddress()}', '${faker.address.secondaryAddress()}', 
      '${faker.address.city()}', '${faker.address.zipCode()}', '${faker.address.country()}', '+34', '${faker.phone.phoneNumber(
        "#########"
      )}')
      `);
    }

    //Extra addresses
    for (let i = 0; i < extraAddresses; i++) {
      await connection.query(`
      INSERT INTO addresses(users_id, alias, name, row1, row2, city, PC, country, prefix, phone_number)
      VALUES ('${random(2, 12)}', '${faker.lorem.words(
        2
      )}', '${faker.name.findName()}', '${faker.address.streetAddress()}', '${faker.address.secondaryAddress()}', 
      '${faker.address.city()}', '${faker.address.zipCode()}', '${faker.address.country()}', '+34', '${faker.phone.phoneNumber(
        "#########"
      )}')
      `);
    }

    //Shops
    const shops = users / 2;
    const randomUserIds = shuffle([...Array(users).keys()]);

    for (let i = 0; i < shops; i++) {
      const userId = randomUserIds[i] + 3;
      const name = faker.lorem.words(random(1, 3));
      const rssName = name.replace(/ /g, "");
      const promoted = Math.random() > 0.75 ? 1 : 0;

      await connection.query(`
      INSERT INTO shops(users_id, name, description, video, twitter, facebook, instagram, promoted)
      VALUES('${userId}', '${name}', '${faker.lorem.paragraph()}', '${
        process.env.PUBLIC_HOST
      }/uploads/video${i}.mp4',
      'https://twitter.com/${rssName}', 'https://www.facebook.com/${rssName}', 'https://www.instagram.com/${rssName}', 
      ${promoted})`);

      await connection.query(`
          UPDATE users SET role = 'vendor' WHERE id = ${userId}
          `);
    }

    //Productos
    const products = 50;

    for (let i = 0; i < products; i++) {
      const stock = sample([0, random(1, 5), random(6, 50), random(51, 500)]);
      const available = stock ? 1 : 0;
      await connection.query(`
      INSERT INTO products(shops_id, category, name, price, stock, available, type, description, color, photo)
      VALUES ('${random(1, shops)}', '${sample(
        categories
      )}', '${faker.lorem.words(random(1, 5))}', '${random(1000, true).toFixed(
        2
      )}', '${stock}', '${available}', '${sample([
        "ready",
        "custom",
      ])}', '${faker.lorem.paragraph()}', '${sampleSize(
        colors,
        random(1, 6)
      )}', '${process.env.PUBLIC_HOST}/uploads/product${i}.jpg')
      `);
    }

    //Ratings
    const ratings = 200;

    for (let i = 0; i < ratings; i++) {
      const userId = random(2, users + 2);
      const productId = random(1, products);

      await connection.query(`
      INSERT INTO ratings(users_id, products_id, rating, comment)
      VALUES ('${userId}', '${productId}', '${random(
        0,
        5
      )}', '${faker.lorem.sentence()}')`);
    }

    //Finished orders
    const finishedOrders = 50;

    for (let i = 0; i < finishedOrders; i++) {
      const userId = random(2, users + 2);
      const [userAddresses] = await connection.query(`
      SELECT id FROM addresses WHERE users_id = '${userId}'
      `);

      const addressId = sample(userAddresses).id;
      const sellDate = formatDateToDB(faker.date.past());

      await connection.query(`
      INSERT INTO orders(users_id, addresses_id, finished, sell_date)
      VALUES ('${userId}', '${addressId}', '1', '${sellDate}')`);

      const productsPerOrder = 3;

      for (let j = 0; j < productsPerOrder; j++) {
        await connection.query(`
      INSERT INTO orders_products(orders_id, products_id, price, quantity)
      VALUES ('${i + 1}', '${random(1, products)}', '${random(
          1000,
          true
        ).toFixed(2)}', '${random(1, 10)}')`);
      }
    }

    //Wishlist
    const listedProducts = 200;

    for (let i = 0; i < listedProducts; i++) {
      const userId = random(2, users + 2);

      await connection.query(`
      INSERT INTO wishlists(users_id, products_id)
      VALUES ('${userId}', '${random(1, products)}')`);
    }

    console.log("Example data added");
  }

  console.log("Initial structure created");

  connection.release();
  process.exit();
}

main();
