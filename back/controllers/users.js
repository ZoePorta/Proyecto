require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getConnection } = require("../db");
const {
  generateError,
  randomString,
  processAndSavePhoto,
  deletePhoto,
  formatDateToDB,
  getAndSendVerificationCode,
} = require("../helpers");

const {
  registerUserSchema,
  loginUserSchema,
  editUserSchema,
} = require("./validations");

async function registerUser(req, res, next) {
  let connection;
  try {
    await registerUserSchema.validateAsync(req.body);

    connection = await getConnection();
    const { email, password, birthDate } = req.body;

    //Check if the eamil is already registered
    const [
      existing,
    ] = await connection.query("SELECT id from users where email=?", [email]);

    if (existing.lenght) {
      throw generateError(
        "There is already an account associated to this email.",
        409
      );
    }

    //hash password
    const dbPassword = await bcrypt.hash(password, 10);

    const registrationCode = await getAndSendVerificationCode(email);

    await connection.query(
      `
INSERT INTO users (email, password, birth_date, registration_code)
VALUES (?, ?, ?, ?)
`,
      [email, dbPassword, birthDate, registrationCode]
    );

    res.send({
      status: "ok",
      message:
        "User registered. Check your email to verify. It may be in the SPAM folder.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Validate user
async function validateUser(req, res, next) {
  let connection;
  try {
    const { code } = req.query;

    connection = await getConnection();

    //Update user
    const [
      result,
    ] = await connection.query(
      "UPDATE users SET active=1, registration_code=NULL WHERE registration_code = ?",
      [code]
    );

    if (result.affectedRows === 0) {
      throw generateError("Wrong confirmation", 400);
    }

    res.send({
      status: "ok",
      message: "Confirmed email. You can login now.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//User login
async function loginUser(req, res, next) {
  let connection;
  try {
    await loginUserSchema.validateAsync(req.body);

    const { email, password } = req.body;

    connection = await getConnection();

    //Find the user in the database
    const [
      dbUser,
    ] = await connection.query(
      "SELECT id, email, password, role, active FROM users WHERE email=?",
      [email]
    );

    const [user] = dbUser;

    if (!user) {
      throw generateError("User not found", 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw generateError("Wrong password", 401);
    }

    if (!user.active) {
      res.send({
        status: "error",
        message: "User not validated. Please confirm you email before login.",
        userId: user.id,
        userEmail: email,
      });
    }
    //Build jsonwebtoken
    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.send({
      status: "ok",
      message: "Login successful.",
      data: { token },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Get user information
async function getInfoUser(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const [result] = await connection.query(
      `
    select  u.id, u.creation_date, email, role, first_name, last_name, birth_date, photo, s.id AS shop_id, name AS shop_name
    FROM users u LEFT JOIN shops s ON u.id = s.users_id WHERE u.id=?
`,
      [id]
    );

    const [userData] = result;

    if (!userData) {
      throw generateError("User not found.", 404);
    }

    const payload = {
      registrationDate: userData.creation_date,
      name: `${userData.first_name} ${userData.last_name}`,
      photo: userData.photo,
    };

    if (userData.shop_id) {
      payload.shopId = userData.shop_id;
      payload.shopName = userData.shop_name;
    }

    if (userData.id === req.auth.id || req.auth.role === "admin") {
      payload.email = userData.email;
      payload.role = userData.role;
      payload.birthDate = userData.birth_date;
    }

    res.send({
      status: "ok",
      data: payload,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Edit user
async function editUser(req, res, next) {
  let connection;
  try {
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    let { firstName, lastName } = req.body;

    connection = await getConnection();

    //check if user exists

    const [current] = await connection.query(
      `
SELECT id, photo, first_name, last_name FROM users WHERE id=?
`,
      [id]
    );

    const [user] = current;

    if (!user) {
      throw generateError(`The user with id ${id} does not exist`, 404);
    }

    //Check if user has permission
    if (user.id !== req.auth.id && req.auth.role !== "admin") {
      throw generateError("You have not permission to edit this user.");
    }

    //Check if there is a uploaded photo and process it

    let savedFileName;

    if (req.files && req.files.photo) {
      try {
        savedFileName = await processAndSavePhoto(req.files.photo);
        if (user && user.photo) {
          await deletePhoto(user.photo);
        }
      } catch (error) {
        throw generateError("Can not process upload image. Try again later.");
      }
    } else {
      savedFileName = user.photo;
    }

    if (!firstName) {
      firstName = user.first_name;
    }
    if (!lastName) {
      lastName = user.last_name;
    }

    //Update user
    await connection.query(
      `
UPDATE users SET first_name=?, last_name=?, photo=? WHERE id=?
`,
      [firstName, lastName, savedFileName, id]
    );

    res.send({
      status: "ok",
      message: "User updated successfully.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Generate new verification code and resend email
async function resendVerificationEmail(req, res, next) {
  let connection;
  try {
    const { id, email } = req.body;
    if (!id || !email) {
      throw generateError("Missing elements.", 400);
    }

    connection = await getConnection();

    //Check if the combination of id and email exists in the database
    const [result] = await connection.query(
      `
    SELECT active FROM users WHERE id=? AND email=?
    `,
      [id, email]
    );

    const [user] = result;

    if (!user) {
      throw generateError("User not found", 404);
    }
    if (user.active) {
      throw generateError("User already active.", 400);
    }

    const registrationCode = await getAndSendVerificationCode(email);

    //Update code on the DB
    await connection.query(
      `
    UPDATE users SET registration_code=? WHERE id=?
    `,
      [registrationCode, id]
    );

    res.send({
      status: "ok",
      message: "Email sent. It may be in the SPAM folder.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release;
    }
  }
}

module.exports = {
  registerUser,
  loginUser,
  getInfoUser,
  editUser,
  /*  updatePasswordUser,*/
  validateUser,
  resendVerificationEmail,
};
