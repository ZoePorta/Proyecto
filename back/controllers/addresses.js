require("dotenv").config();

const { getConnection } = require("../db");
const { generateError } = require("../helpers");

const { addressSchema } = require("./validations");

//// LIST USERS'S ADDRESSES/////
async function listAddress(req, res, next) {
  let connection;
  try {
    const { userId } = req.auth;

    connection = await getConnection();

    const [addresses] = await connection.query(
      `
    SELECT id as addressId, alias, name, row1, row2, city, PC, country, prefix, phone_number FROM addresses WHERE users_id=?
    `,
      [userId]
    );

    if (!addresses.length) {
      throw generateError(`You don't have any addresses yet.`, 404);
    }

    res.send({
      status: "ok",
      message: addresses,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////ADD ADDRESS////
async function addAddress(req, res, next) {
  let connection;
  try {
    await addressSchema.validateAsync(req.body);
    const { userId } = req.auth;
    const {
      alias,
      name,
      row1,
      row2,
      city,
      postalCode,
      country,
      prefix,
      phoneNumber,
    } = req.body;

    connection = await getConnection();

    await connection.query(
      `
  INSERT INTO addresses (users_id, alias, name, row1, row2, city, PC, country, prefix, phone_number)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
      [
        userId,
        alias,
        name,
        row1,
        row2,
        city,
        postalCode,
        country,
        prefix,
        phoneNumber,
      ]
    );

    res.send({
      status: "ok",
      message: "Address added successfully.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////MODIFY ADDRESS////
async function modifyAddress(req, res, next) {
  let connection;
  try {
    await addressSchema.validateAsync(req.body);
    const { userId, role } = req.auth;
    const { addressId } = req.params;

    connection = await getConnection();

    //Check if user has access
    const [result] = await connection.query(
      `
SELECT users_id FROM addresses WHERE id=?
`,
      [addressId]
    );

    const [user] = result;

    if (userId !== user.users_id && role !== "admin") {
      throw generateError(`You can not change this address.`, 401);
    }

    const {
      alias,
      name,
      row1,
      row2,
      city,
      postalCode,
      country,
      prefix,
      phoneNumber,
    } = req.body;

    await connection.query(
      `
  UPDATE addresses SET alias =?, name=?, row1=?, row2=?, city=?, PC=?, country=?, prefix=?, phone_number=? WHERE id=?
  `,
      [
        alias,
        name,
        row1,
        row2,
        city,
        postalCode,
        country,
        prefix,
        phoneNumber,
        addressId,
      ]
    );

    res.send({
      status: "ok",
      message: "Address updated successfully.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

////DELETE ADDRESS////
async function deleteAddress(req, res, next) {
  let connection;
  try {
    const { userId, role } = req.auth;
    const { addressId } = req.params;

    connection = await getConnection();

    //Check if user has access
    const [result] = await connection.query(
      `
SELECT users_id FROM addresses WHERE id=?
`,
      [addressId]
    );

    const [user] = result;

    if (userId !== user.users_id && role !== "admin") {
      throw generateError(`You can not delete this address.`, 401);
    }

    await connection.query(
      `
  DELETE FROM addresses WHERE id=?
  `,
      [addressId]
    );

    res.send({
      status: "ok",
      message: "Address deleted successfully.",
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
  listAddress,
  addAddress,
  modifyAddress,
  deleteAddress,
};
