const { getConnection } = require("../db");
const { generateError } = require("../helpers");
const { productSchema, rateSchema } = require("./validations");

////ADD NEW PRODUCT
async function newProduct(req, res, next) {
  const { shopId } = req.auth;

  let connection;
  try {
    if (!shopId) {
      throw generateError(`You do not have a shop.`, 401);
    }
    await productSchema.validateAsync(req.body);
    connection = await getConnection();
    const {
      name,
      description,
      category,
      price,
      stock,
      available,
      color,
    } = req.body;

    const [product] = await connection.query(
      `
  INSERT INTO products (shops_id, name, description, category, price, stock, available, color) 
  VALUES (?, ?, ?, ?, ?, ?, ?) 
  `,
      [shopId, name, description, category, price, stock, available, color]
    );

    res.send({
      status: "ok",
      message: "Product added succesfully.",
      productId: product.insertId,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////EDIT PRODUCT
async function editProduct(req, res, next) {
  const { shopId, role } = req.auth;
  const { productId } = req.params;

  let connection;
  try {
    if (!shopId) {
      throw generateError(`You do not have a shop.`, 401);
    }
    await productSchema.validateAsync(req.body);
    connection = await getConnection();
    const {
      name,
      description,
      category,
      price,
      stock,
      available,
      color,
    } = req.body;

    //Check if user has permission
    const [result] = await connection.query(
      `
  SELECT shop_id FROM products WHERE id=?
  `,
      [productId]
    );

    const [product] = result;
    if (!product) {
      throw generateError(`Product not found`, 404);
    }

    if (Number(shopId) !== product.shop_id && role !== "admin") {
      throw generateError(`You can not edit this product.`, 401);
    }

    //Update product
    await connection.query(
      `
UPDATE products SET name=?, description=?, category=?, price=?, stock=?, available=?, color=? WHERE id=?
`,
      [name, description, category, price, stock, availabe, color, productId]
    );

    res.send({
      status: "ok",
      message: "Product updated.",
      productId: product.insertId,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////DELETE PRODUCT
async function deleteProduct(req, res, next) {
  let connection;
  try {
    const { productId } = req.params;
    connection = await getConnection();

    //Check if user has permission
    const [result] = await connection.query(
      `
  SELECT shop_id FROM products WHERE id=?
  `,
      [productId]
    );

    const [product] = result;
    if (!product) {
      throw generateError(`Product not found`, 404);
    }

    if (Number(shopId) !== product.shop_id && role !== "admin") {
      throw generateError(`You can not edit this product.`, 401);
    }

    await connection.query(
      `
DELETE FROM products WHERE id=?
`,
      [productId]
    );

    res.send({
      status: "ok",
      message: `Product ${productId} deleted. Login again to get a new token.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////LIST PRODUCTS
async function searchProduct(req, res, next) {
  let connection;
  try {
    /*     const searchObject = ({
      words,
      priceMax,
      priceMin,
      category,
      type,
      color,
      avgRating,
    } = req.query); */
    connection = await getConnection();
    let [result] = await connection.query(`
    SELECT name, description, price, category, available, type, color, avg(rating) AS avgRating, concat('[', GROUP_CONCAT(path),']') AS photos  from products pr LEFT JOIN photos ph ON pr.id = ph.products_id LEFT JOIN ratings r ON pr.id = r.products_id group by pr.id;
    `);

    for (const key in req.query) {
      switch (key) {
        case "category":
        case "type":
          result = result.filter((product) => product[key] === req.query[key]);
          console.log(key);

          break;
        case "priceMax":
          result = result.filter(
            (product) => Number(product.price) <= req.query[key]
          );
          break;
        case "priceMin":
          result = result.filter(
            (product) => Number(product.price) >= req.query[key]
          );
          break;
        case "words":
          result = result.filter(
            (product) =>
              product.name.toLowerCase().includes(req.query[key].toLowerCase) ||
              product.description
                .toLowerCase()
                .includes(req.query[key].toLowerCase())
          );
          break;
        case "color":
          /////CODIGO//////
          break;
        case "avgRating":
          result = result.filter(
            (product) => Number(product.avgRating) >= req.query[key]
          );
      }
    }
    console.log(result);
    console.log(req.query);
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////RATE PRODUCT
async function rateProduct(req, res, next) {
  let connection;
  try {
    if (!req.auth) {
      throw generateError(`You must be logged.`, 401);
    }
    await rateSchema.validateAsync(req.body);
    const { rating, comment } = req.body;
    const { id } = req.auth;
    const { productId } = req.params;

    connection = await getConnection();

    //Check if user already rated the product
    const [result] = await connection.query(
      `
    SELECT id FROM ratings WHERE users_id=? AND products_id=?
    `,
      [id, productId]
    );

    if (result.length) {
      throw generateError(`You have already rated this product.`, 401);
    }

    await connection.query(
      `
    INSERT INTO ratings (users_id, products_id, rating, comment)
    VALUES (?, ?, ?, ?)
    `,
      [id, productId, rating, comment]
    );
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////MODIFY RATING
async function modifyRatingProduct(req, res, next) {
  let connection;
  try {
    if (!req.auth) {
      throw generateError(`You must be logged.`, 401);
    }
    await rateSchema.validateAsync(req.body);
    const { rating, comment } = req.body;
    const { id } = req.auth;
    const { productId } = req.params;

    connection = await getConnection();

    const [result] = await connection.query(
      `
    UPDATE ratings SET rating=?, comment=? WHERE users_id=? AND products_id=?
    `,
      [rating, comment, id, productId]
    );

    if (result.affectedRows === 0) {
      throw generateError("You did not rate this product yet.", 400);
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  newProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  rateProduct,
  modifyRatingProduct,
};
