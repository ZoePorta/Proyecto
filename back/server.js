require("dotenv").config();

const express = require("express");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const {
  userIsAuthenticated,
  userIsAdmin,
  userIsVendor,
} = require("./middlewares/auth");

const app = express();

//Controllers
const {
  registerUser,
  loginUser,
  getInfoUser,
  editUser,
  updatePasswordUser,
  updateEmailUser,
  validateUser,
  validateEmailUser,
  resendVerificationEmail,
} = require("./controllers/users");

const {
  createShop,
  editShop,
  promoteShop,
  unpromoteShop,
  deleteShop,
} = require("./controllers/shops");

//Logger middleware
app.use(morgan("dev"));

//Body parser middleware
app.use(bodyParser.json());

//Multipart parsing middleware
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "static")));

//Routes
/////Users
app.post("/users", registerUser);
app.post("/users/login", loginUser);
app.post("/users/resendmail", resendVerificationEmail);
app.get("/users/validate", validateUser);
app.get("/users/validateEmail", validateEmailUser);
app.get("/users/:id", userIsAuthenticated, getInfoUser);
app.put("/users/:id", userIsAuthenticated, editUser);
app.put("/users/:id/password", userIsAuthenticated, updatePasswordUser);
app.put("/users/:id/email", userIsAuthenticated, updateEmailUser);

/////Products
//app.get("/products", listProducts);
app.post("/products", userIsAuthenticated, userIsVendor);
//app.get("/products/:id", getProduct);
//app.post("/products/:id/rate", userIsAuthenticated, rateProduct);

/////Shops
app.post("/shops", userIsAuthenticated, createShop);
app.put("/shops/:shopId", userIsAuthenticated, userIsVendor, editShop);
app.put(
  "/shops/:shopId/promote",
  userIsAuthenticated,
  userIsAdmin,
  promoteShop
);
app.put(
  "/shops/:shopId/unpromote",
  userIsAuthenticated,
  userIsAdmin,
  unpromoteShop
);
app.delete("/shops/:shopId", userIsAuthenticated, userIsVendor, deleteShop);
//Error middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpCode || 500).send({
    status: "error",
    message: error.message,
  });
});

//Not found middleware
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
