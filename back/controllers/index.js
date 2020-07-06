const { getConnection } = require("../db");
const { generateError } = require("../helpers");
const { sample, sampleSize } = require("lodash");

async function getPromotedShop() {
  let connection;
  try {
    connection = await getConnection();

    let [result] = await connection.query(`
    SELECT id AS shopId, users_id as userId, name, video FROM shops WHERE promoted=1 
    `);

    if (!result.length) {
      [result] = await connection.query(`
    SELECT id AS shopId, users_id as userId, name, video FROM shops 
    `);
    }

    const { shopId, userId, name, video } = sample(result);
    const payload = { shopId, userId, name };

    if (video) {
      payload.video = video;
    } else {
      /////CODIGO PARA SUSTITUIR EL VIDEO POR IMAGENES//////
    }

    return payload;
  } catch (error) {
    throw generateError(`Error getting promoted shop.`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getProducts(quantity) {
  let connection;
  try {
    connection = await getConnection();

    const [results] = await connection.query(
      `
    SELECT pr.id, pr.name, s.name AS shopName, category, price, available, 
    type, photo, color, avg(rating) AS avgRating, COUNT(rating) AS votes 
    from products pr 
    LEFT JOIN ratings r ON pr.id = r.products_id 
        LEFT JOIN shops s ON shops_id = s.id
    WHERE AVAILABLE=1 group by pr.id
    `
    );

    const products = sampleSize(results, quantity);

    const productsArray = [];
    products.forEach((row) => {
      const product = {};
      Object.keys(row).forEach((key) => (product[key] = row[key]));

      productsArray.push(product);
    });

    return productsArray;
  } catch (error) {
    console.error(error);
    throw generateError(`Error finding products.`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getIndex(req, res, next) {
  try {
    const promotedShop = await getPromotedShop();
    const products = await getProducts(10);

    res.send({ status: "ok", message: { promotedShop, products } });
  } catch (error) {
    next(error);
  }
}

module.exports = { getIndex };
