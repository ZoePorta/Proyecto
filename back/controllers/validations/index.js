const Joi = require("@hapi/joi");
const JoiAge = Joi.extend(require("joi-age"));

const { generateError, categories, colors } = require("../../helpers");

//General schemas///////////
const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError("Invalid email.", 400));

////////////////
const passwordSchema = Joi.string()
  .min(6)
  .max(20)
  .required()
  .error(
    generateError(
      "The password must contain more than 6 and less tahn 20 characters.",
      400
    )
  );

//Users//////////
////Registration///////
const registerUserSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
  birthDate: JoiAge.date()
    .minAge(16)
    .maxAge(120)
    .required()
    .error(generateError("Must be older than 16 years old to register.", 400)),
});

////Login///////////
const loginUserSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
});

////Edit///////////////////
const editUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .max(50)
    .error(
      generateError("First name can not be longer than 50 characters.", 400)
    ),
  lastName: Joi.string()
    .max(50)
    .error(
      generateError("Last name can not be longer than 50 characters.", 400)
    ),
});

////Edit password/////////
const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

////Address/////
const addressSchema = Joi.object().keys({
  alias: Joi.string()
    .max(255)
    .required()
    .error(generateError("Alias can not be longer than 255 characters.", 400)),
  name: Joi.string()
    .max(255)
    .required()
    .error(generateError("Name can not be longer than 255 characters.", 400)),
  row1: Joi.string()
    .max(255)
    .required()
    .error(generateError("Row 1 can not be longer than 255 characters.", 400)),
  row2: Joi.string()
    .max(255)
    .error(generateError("Row 2 can not be longer than 255 characters.", 400)),
  city: Joi.string()
    .max(255)
    .required()
    .error(generateError("City can not be longer than 255 characters.", 400)),
  postalCode: Joi.number()
    .integer()
    .positive()
    .max(9999999999)
    .required()
    .error(generateError(`Please, enter a valid Postal Code.`, 400)),
  country: Joi.string()
    .max(100)
    .required()
    .error(
      generateError("Country can not be longer than 100 characters.", 400)
    ),
  prefix: Joi.string()
    .max(5)
    .error(generateError("Prefix can not be longer than 5 characters.", 400)),
  phoneNumber: Joi.number()
    .integer()
    .positive()
    .max(9999999999)
    .error(generateError(`Please, enter a valid phone number.`)),
});

//////
//Shop//////////
const shopSchema = Joi.object().keys({
  name: Joi.string()
    .max(100)
    .error(generateError("Name can not be longer than 100 characters.", 400)),
  description: Joi.string()
    .max(500)
    .error(
      generateError("Description can not be longer than 500 characters.", 400)
    ),
  video: Joi.string().uri().trim(),
  twitter: Joi.string().uri().trim(),
  facebook: Joi.string().uri().trim(),
  instagram: Joi.string().uri().trim(),
});

/////////
//Products///////
const productSchema = Joi.object().keys({
  category: Joi.string()
    .valid(...categories)
    .required()
    .error(generateError(`Must select a correct category.`, 400)),
  name: Joi.string()
    .max(100)
    .required()
    .error(generateError("Name can not be longer than 100 characters.", 400)),
  price: Joi.number()
    .positive()
    .precision(2)
    .max(99999)
    .required()
    .error(
      generateError(
        `You must set a price. It can be more than 99999 nor have more than two decimals.`,
        400
      )
    ),
  stock: Joi.number()
    .integer()
    .positive()
    .max(1000)
    .required()
    .error(
      generateError(
        `You must set a stock under 1000 units. You can update it whenever you want.`,
        400
      )
    ),
  available: Joi.binary()
    .max(1)
    .default(0)
    .error(generateError(`You must select a valid availability option.`, 400)),
  type: Joi.string()
    .valid("available", "custom")
    .default("ready")
    .error(generateError(`You must select a valid type option.`, 400)),
  description: Joi.string()
    .max(500)
    .error(
      generateError("Description can not be longer than 500 characters.", 400)
    ),
  color: Joi.array()
    .items(
      Joi.string()
        .valid(...colors)
        .default("other")
    )
    .unique()
    .required()
    .error(
      generateError(`You must select one or more valid color options.`, 400)
    ),
});

//Ratings/////////////////////
const rateSchema = Joi.object().keys({
  rating: Joi.number()
    .positive()
    .precision(1)
    .max(5)
    .required()
    .error(generateError(`You must vote with up to 5 points.`, 400)),
  comment: Joi.string()
    .max(255)
    .error(
      generateError(`This field can be no longer than 255 characters.`, 400)
    ),
});

module.exports = {
  emailSchema,
  registerUserSchema,
  loginUserSchema,
  editUserSchema,
  editPasswordUserSchema,
  shopSchema,
  productSchema,
  rateSchema,
  // searchSchema,
  addressSchema,
};
