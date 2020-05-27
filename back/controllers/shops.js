const { getConnection } = require("../db");
const { generateError } = require("../helpers");
const { shopSchema } = require("./validations");

async function createShop(req, res, next) {
  const { id, role } = req.auth;

  let connection;
  try {
    if (role === "vendor") {
      throw generateError(`You already have a shop.`, 401);
    }
    await shopSchema.validateAsync(req.body);
    connection = await getConnection();
    const { name, description, video, twitter, facebook, instagram } = req.body;

    const [shop] = await connection.query(
      `
  INSERT INTO shops (users_id, name, description, video, twitter, facebook, instagram) 
  VALUES (?, ?, ?, ?, ?, ?, ?) 
  `,
      [id, name, description, video, twitter, facebook, instagram]
    );

    await connection.query(
      `
  UPDATE users SET role="vendor", forced_expiration_date=CURRENT_TIMESTAMP WHERE id=?
  `,
      [id]
    );

    res.send({
      status: "ok",
      message:
        "Shop created succesfully. Login again to get your vendor token.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function editShop(req, res, next) {
  let connection;
  try {
    const { shopId } = req.params;
    await shopSchema.validateAsync(req.body);

    const { name, description, video, twitter, facebook, instagram } = req.body;

    connection = await getConnection();

    //Check if user has permission
    if (Number(shopId) !== req.auth.shopId && req.auth.role !== "admin") {
      throw generateError("You have not permission to edit this shop.");
    }

    //Update user
    const [result] = await connection.query(
      `
          UPDATE shops SET name=?, description=?, video=?, twitter=?, facebook=?, instagram=? WHERE id=?
          `,
      [name, description, video, twitter, facebook, instagram, shopId]
    );

    if (result.affectedRows === 0) {
      throw generateError(`The shop with id ${shopId} does not exist`, 404);
    }
    res.send({
      status: "ok",
      message: "Shop updated successfully.",
    });
    console.log("llega hasta aqui");
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Promote shop
async function promoteShop(req, res, next) {
  let connection;
  try {
    const { shopId } = req.params;

    connection = await getConnection();

    const [result] = await connection.query(
      `
      UPDATE shops SET promoted=1 WHERE id=?
      `,
      [shopId]
    );

    if (result.affectedRows === 0) {
      throw generateError("Shop not found", 404);
    }

    res.send({
      status: "ok",
      message: `Shop ${shopId} is now promoted.`,
    });
    console.log("llega hasta aqui");
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Unpromote shop
async function unpromoteShop(req, res, next) {
  let connection;
  try {
    const { shopId } = req.params;

    connection = await getConnection();

    const result = await connection.query(
      `
    UPDATE shops SET promoted=0 WHERE id=?
    `,
      [shopId]
    );

    if (result.affectedRows === 0) {
      throw generateError("Shop not found", 404);
    }

    res.send({
      status: "ok",
      message: `Shop ${shopId} is not promoted anymore.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Delete shop
async function deleteShop(req, res, next) {
  let connection;
  try {
    const { shopId } = req.params;
    //Check if user has permission
    if (Number(shopId) !== req.auth.shopId && req.auth.role !== "admin") {
      throw generateError("You have not permission to edit this shop.");
    }

    connection = await getConnection();

    //get shop's owner
    const [result] = await connection.query(
      `
    SELECT users_id FROM shops WHERE id=?
    `,
      [shopId]
    );

    const [ownerId] = result;

    if (!ownerId) {
      throw generateError(`Shop not found`, 404);
    }

    await connection.query(
      `
DELETE FROM shops WHERE id=?
`,
      [shopId]
    );

    await connection.query(
      `
UPDATE users SET role='regular', forced_expiration_date=CURRENT_TIMESTAMP WHERE id=?
`,
      [ownerId]
    );

    res.send({
      status: "ok",
      message: `Shop ${shopId} deleted. Login again to get a new token.`,
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
  createShop,
  editShop,
  promoteShop,
  unpromoteShop,
  deleteShop,
};
