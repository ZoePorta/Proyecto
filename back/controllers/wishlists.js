const { getConnection } = require("../db");
const { generateError } = require("../helpers");

///// GET WISHLIST
async function listWishlist(req, res, next) {
  let connection;
  try {
    const { userId } = req.params;
    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT pr.id AS id, name, price, available, type, photo, color, avg(rating) AS avgRating, COUNT(rating) AS votes from wishlists w LEFT JOIN products pr ON w.products_id = pr.id LEFT JOIN ratings r ON pr.id = r.products_id WHERE w.users_id=? group by pr.id
    `,
      [userId]
    );

    const [user] = await connection.query(
      `
    SELECT first_name FROM users WHERE id=?
    `,
      [userId]
    );

    res.send({
      status: "ok",
      result,
      user,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////ADD PRODUCT TO WISHLIST
async function addToWishlist(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    const { productId } = req.params;
    connection = await getConnection();

    //Check if the product is already in the wishlist
    const [result] = await connection.query(
      `
SELECT id FROM wishlists WHERE users_id=? AND products_id=?
`,
      [userId, productId]
    );

    if (result.length) {
      throw generateError(`This product is already in your wishlist`, 409);
    }

    await connection.query(
      `
INSERT INTO wishlists (users_id, products_id)
VALUES(?, ?)
`,
      [userId, productId]
    );

    res.send({
      status: "ok",
      message: "Product added to wishlist.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

///// DELETE FROM WISHLIST
async function deleteFromWishlist(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;
    const { productId } = req.params;
    connection = await getConnection();

    const [result] = await connection.query(
      `
DELETE FROM wishlists WHERE users_id=? AND products_id=?
`,
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      throw generateError("This product was not in your wishlist.", 400);
    }

    res.send({
      status: "ok",
      message: "Product removed from wishlist.",
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
  listWishlist,
  addToWishlist,
  deleteFromWishlist,
};
