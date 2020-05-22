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

    //Check if token expedittion time is grater than users's last password change
    const { id, iat } = decoded;

    console.log(new Date(iat * 1000), "iat");
    connection = await getConnection();

    const [
      result,
    ] = await connection.query(
      "SELECT last_password_update, email FROM users WHERE id=?",
      [id]
    );

    const [user] = result;

    if (!user) {
      throw generateError("There is no user with such id in the database.");
    }

    const lastPasswordUnixTime = new Date(user.last_password_update).getTime();

    console.log(new Date(user.last_password_update), "update");

    if (new Date(iat * 1000) < new Date(user.last_password_update)) {
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

module.exports = {
  userIsAuthenticated,
  userIsAdmin,
};
