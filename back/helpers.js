require("dotenv").config();

const { format } = require("date-fns");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");
const uuid = require("uuid");

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

//Global arrays
const categories = [
  "supplies",
  "headwear",
  "clothing",
  "decor",
  "jewerly",
  "accesories",
  "bags",
  "other",
];
const colors = [
  "black",
  "white",
  "gray",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "brown",
  "pink",
  "multiple",
  "other",
];

//Format a date to DB
function formatDateToDB(date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

//Generate new error
function generateError(message, code) {
  const error = new Error(message);
  if (code) error.httpCode = code;
  return error;
}

//Generate random string
function randomString(size = 20) {
  return crypto.randomBytes(size).toString("hex").slice(0, size);
}

//Send generic email
async function sendEmail({ email, title, msgHtml }) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: title,
      html: msgHtml,
    };

    console.log("sending email");

    await sgMail.send(msg);
  } catch (error) {
    throw generateError(`Error sending the email.`);
  }
}

//Process and save an image and get it's filename
async function processAndSavePhoto(uploadedImage) {
  //Random generated name to save it
  const savedFileName = `${uuid.v1()}.jpg`;

  //Ensure path
  await fs.ensureDir(imageUploadPath);

  //Process image
  const finalImage = sharp(uploadedImage.data);

  //Make sure image is not wider than 500px
  const imageInfo = await finalImage.metadata();

  if (imageInfo.width > 500) {
    finalImage.resize(500);
  }

  //Save image
  await finalImage.toFile(path.join(imageUploadPath, savedFileName));

  return `${process.env.PUBLIC_HOST}/uploads/${savedFileName}`;
}

//Delete a photo
async function deletePhoto(imagePath) {
  const fileName = imagePath.split("/").reverse()[0];
  await fs.unlink(path.join(imageUploadPath, imagePath));
}

//send verification email and get the code
async function getAndSendVerificationCode(email, change) {
  const verificationCode = randomString(40);
  let validationURL = `${process.env.FRONT_URL}validate?code=${verificationCode}`;

  if (change) {
    validationURL = `${process.env.FRONT_URL}validate?code=${verificationCode}&email=${email}`;
  }

  try {
    await sendEmail({
      email: email,
      title: "Confirm your email",
      msgHtml: `<div><h1> Please, click <a href='${validationURL}' alt='confirmation link'>here</a> to confirm your email adress.</h1>
    </div>`,
    });
  } catch (error) {
    throw generateError(
      "Error sending the confirmation email. Try again later."
    );
  }
  return verificationCode;
}

module.exports = {
  formatDateToDB,
  generateError,
  randomString,
  sendEmail,
  processAndSavePhoto,
  deletePhoto,
  getAndSendVerificationCode,
  categories,
  colors,
};
