require("dotenv").config();

const express = require("express");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const { userIsAuthenticated, userIsAdmin } = require("./middlewares/auth");

const app = express();

//Controllers
const {
  registerUser,
  loginUser,
  getInfoUser,
  editUser,
  /* updatePasswordUser,*/
  validateUser,
  resendVerificationEmail,
} = require("./controllers/users");

//Logger middleware
app.use(morgan("dev"));

//Body parser middleware
app.use(bodyParser.json());

//Multipart parsing middleware
app.use(fileUpload());

//Routes
/////Users
app.post("/users", registerUser);
app.post("/users/login", loginUser);
app.post("/users/resendmail", resendVerificationEmail);
app.get("/users/:id", userIsAuthenticated, getInfoUser);
app.put("/users/:id", userIsAuthenticated, editUser);
/*app.put("/users/:id/password", updatePasswordUser);*/
app.get("/users/:id/validate", validateUser);

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
