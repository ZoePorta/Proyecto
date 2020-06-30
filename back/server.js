require("dotenv").config();

const express = require("express");

const cors = require("cors");
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
const { getIndex } = require("./controllers");

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
  deleteUser,
} = require("./controllers/users");

const {
  listAddress,
  addAddress,
  modifyAddress,
  deleteAddress,
} = require("./controllers/addresses");

const {
  getShop,
  createShop,
  editShop,
  promoteShop,
  unpromoteShop,
  deleteShop,
} = require("./controllers/shops");

const {
  getProduct,
  newProduct,
  editProduct,
  deleteProduct,
  listProducts,
  rateProduct,
  modifyRatingProduct,
} = require("./controllers/products");

const {
  listWishlist,
  addToWishlist,
  deleteFromWishlist,
} = require("./controllers/wishlists");

const {
  showCurrentOrder,
  showFinishedOrders,
  addToOrder,
  deleteFromOrder,
  checkoutOrder,
  finishOrder,
} = require("./controllers/orders");

//Logger middleware
app.use(morgan("dev"));

//CORS
app.use(cors());

//Body parser middleware
app.use(bodyParser.json());

//Multipart parsing middleware
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "static")));

//Routes
app.get("/", getIndex);

/////Users
app.post("/users", registerUser);
app.post("/users/login", loginUser);
app.post("/users/resendmail", resendVerificationEmail);
app.get("/users/validate", validateUser);
app.get("/users/validateEmail", validateEmailUser);
app.get("/users/:userId", userIsAuthenticated, getInfoUser);
app.put("/users/:userId", userIsAuthenticated, editUser);
app.put("/users/:userId/password", userIsAuthenticated, updatePasswordUser);
app.put("/users/:userId/email", userIsAuthenticated, updateEmailUser);
app.delete("/users/:userId", userIsAuthenticated, deleteUser);

/////Addresses
app.get("/addresses", userIsAuthenticated, listAddress);
app.post("/addresses", userIsAuthenticated, addAddress);
app.put("/addresses/:addressId", userIsAuthenticated, modifyAddress);
app.delete("/addresses/:addressId", userIsAuthenticated, deleteAddress);

/////Products
app.get("/products", listProducts);
app.get("/products/:productId", getProduct);
app.post("/products", userIsAuthenticated, userIsVendor, newProduct);
app.put("/products/:productId", userIsAuthenticated, userIsVendor, editProduct);
app.delete(
  "/products/:productId",
  userIsAuthenticated,
  userIsVendor,
  deleteProduct
);
app.post("/products/:productId/rate", userIsAuthenticated, rateProduct);
app.put("/products/:productId/rate", userIsAuthenticated, modifyRatingProduct);

/////Shops
app.get("/shops/:shopId", getShop);
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

//////Whishlist
app.get("/wishlist/:userId", listWishlist);
app.post("/wishlist/:productId", userIsAuthenticated, addToWishlist);
app.delete("/wishlist/:productId", userIsAuthenticated, deleteFromWishlist);

/////Orders
app.get("/orders/cart", userIsAuthenticated, showCurrentOrder);
app.put("/orders/cart/checkout", userIsAuthenticated, checkoutOrder);
app.put("/orders/cart/finish", userIsAuthenticated, finishOrder);
app.post("/orders/cart/:productId", userIsAuthenticated, addToOrder);
app.delete("/orders/cart/:productId", userIsAuthenticated, deleteFromOrder);
app.get("/orders", userIsAuthenticated, showFinishedOrders);

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
