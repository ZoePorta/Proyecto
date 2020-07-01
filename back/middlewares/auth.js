require("dotenv").config();
const jwt = require("jsonwebtoken");

const { getConnection } = require("../db");
const { generateError } = require("../helpers");

async function userIsAuthenticated(req, res, next) {
  let connection;

  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw generateError("Authorization header is missing.");
    }

    const authorizationParts = authorization.split(" ");

    let token;

    if (authorizationParts.length === 1) {
      token = authorization;
    } else if (authorizationParts[0] === "Bearer") {
      token = authorizationParts[1];
    } else {
      throw generateError("Can not read token.");
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw generateError("Wrong token.");
    }

    //Check if token expedittion time is valid
    const { userId, iat } = decoded;

    connection = await getConnection();

    const [
      result,
    ] = await connection.query(
      "SELECT forced_expiration_date, email FROM users WHERE id=?",
      [userId]
    );

    const [user] = result;

    if (!user) {
      throw generateError("There is no user with such id in the database.");
    }

    const forcedExpirationUnixTime = new Date(
      user.forced_expiration_date
    ).getTime();

    if (new Date(iat * 1000) < forcedExpirationUnixTime) {
      throw generateError("Expired token. Login to get a new one.");
    }

    req.auth = decoded;
    next();
  } catch (error) {
    error.httpCode = 401;
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

function userIsAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== "admin") {
    return next(generateError("You do not have admin privileges.", 401));
  }

  next();
}

async function userIsVendor(req, res, next) {
  if (req.auth.role === "admin") {
    next();
  }
  if (!req.auth || req.auth.role !== "vendor") {
    return next(generateError("You do not have a shop.", 401));
  }

  let connection;
  try {
    const { userId } = req.auth;

    connection = await getConnection();

    const [result] = await connection.query(
      `
    SELECT id FROM shops WHERE users_id=?
    `,
      [userId]
    );

    const [shop] = result;

    if (!shop) {
      throw generateError(`Shop not found.`, 404);
    }

    req.auth.shopId = shop.id;

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  userIsAuthenticated,
  userIsAdmin,
  userIsVendor,
};
