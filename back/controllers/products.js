const { getConnection } = require("../db");
const {
  generateError,
  processAndSavePhoto,
  deletePhoto,
} = require("../helpers");
const { productSchema, rateSchema } = require("./validations");

////GET PRODUCT INFO////
async function getProduct(req, res, next) {
  let connection;

  try {
    const { productId } = req.params;
    connection = await getConnection();
    const [result] = await connection.query(
      /*  //Multiple photos per product not implemented yed
     `
    SELECT name, description, price, category, available, type, color, avg(rating) AS avgRating, GROUP_CONCAT(path) AS photos  from products pr LEFT JOIN photos ph ON pr.id = ph.products_id LEFT JOIN ratings r ON pr.id = r.products_id WHERE pr.id=? group by pr.id;
    `, */
      `
    SELECT name, description, price, category, available, type, color, photo, avg(rating) AS avgRating  from products pr LEFT JOIN ratings r ON pr.id = r.products_id WHERE pr.id=? group by pr.id;
    `,
      [productId]
    );

    if (!result.length) {
      throw generateError(`Product not found.`, 404);
    }

    const [ratings] = await connection.query(
      `
    SELECT rating, comment FROM ratings WHERE products_id=?
    `,
      [productId]
    );

    res.send({
      status: "ok",
      message: { result, ratings },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

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

    let savedFileName = null;
    if (req.files && req.files.photo) {
      try {
        savedFileName = await processAndSavePhoto(req.files.photo);
      } catch (error) {
        throw generateError("Can not process upload image. Try again later.");
      }
    }

    const colorString = `${color}`;
    const [product] = await connection.query(
      `
  INSERT INTO products (shops_id, name, description, category, price, stock, available, color, photo) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ) 
  `,
      [
        shopId,
        name,
        description,
        category,
        price,
        stock,
        available,
        colorString,
        savedFileName,
      ]
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
  SELECT shops_id, photo FROM products WHERE id=?
  `,
      [productId]
    );

    const [product] = result;
    if (!product) {
      throw generateError(`Product not found`, 404);
    }

    if (shopId !== product.shops_id && role !== "admin") {
      throw generateError(`You can not edit this product.`, 401);
    }

    let savedFileName;

    if (req.files && req.files.photo) {
      try {
        savedFileName = await processAndSavePhoto(req.files.photo);
        if (product.photo) {
          await deletePhoto(product.photo);
        }
      } catch (error) {
        throw generateError("Can not process upload image. Try again later.");
      }
    } else {
      savedFileName = product.photo;
    }

    //Update product

    const colorString = `${color}`;
    await connection.query(
      `
UPDATE products SET name=?, description=?, category=?, price=?, stock=?, available=?, color=?, photo=? WHERE id=?
`,
      [
        name,
        description,
        category,
        price,
        stock,
        available,
        colorString,
        savedFileName,
        productId,
      ]
    );

    res.send({
      status: "ok",
      message: "Product updated.",
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
    const { shopId, role } = req.auth;
    const { productId } = req.params;
    connection = await getConnection();

    //Check if user has permission
    const [result] = await connection.query(
      `
  SELECT shops_id FROM products WHERE id=?
  `,
      [productId]
    );

    const [product] = result;
    if (!product) {
      throw generateError(`Product not found`, 404);
    }

    if (shopId !== product.shops_id && role !== "admin") {
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
      message: `Product ${productId} deleted.`,
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
async function listProducts(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    let [result] = await connection.query(
      `
    SELECT name, description, price, category, available, type, color, photo, avg(rating) AS avgRating from products pr LEFT JOIN ratings r ON pr.id = r.products_id group by pr.id;
    `
    );

    /*   MOVE TO FRONT

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
          const searchColorArray = req.query[key].split(" ");
          const comparer = (boolean, color) =>
            searchColorArray.includes(color) || boolean;
          result = result.filter((product) => {
            const productColorArray = product.color.split(",");
            return productColorArray.reduce(comparer, false);
          });
          break;
        case "avgRating":
          result = result.filter(
            (product) => Number(product.avgRating) >= req.query[key]
          );
      }
    }
 */
    res.send({
      status: "ok",
      results: result.length,
      message: { results: result.length, result },
    });
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
    const { userId } = req.auth;
    const { productId } = req.params;

    connection = await getConnection();

    //Check if user already rated the product
    const [result] = await connection.query(
      `
    SELECT id FROM ratings WHERE users_id=? AND products_id=?
    `,
      [userId, productId]
    );

    if (result.length) {
      throw generateError(`You have already rated this product.`, 401);
    }

    await connection.query(
      `
    INSERT INTO ratings (users_id, products_id, rating, comment)
    VALUES (?, ?, ?, ?)
    `,
      [userId, productId, rating, comment]
    );

    res.send({
      status: "ok",
      message: `You voted this product with ${rating} stars.`,
    });
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
    const { userId } = req.auth;
    const { productId } = req.params;

    connection = await getConnection();

    const [result] = await connection.query(
      `
    UPDATE ratings SET rating=?, comment=? WHERE users_id=? AND products_id=?
    `,
      [rating, comment, userId, productId]
    );

    if (result.affectedRows === 0) {
      throw generateError("You did not rate this product yet.", 400);
    }

    res.send({
      status: "ok",
      message: `You changed your vote to ${rating} stars.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  getProduct,
  newProduct,
  editProduct,
  deleteProduct,
  listProducts,
  rateProduct,
  modifyRatingProduct,
};
