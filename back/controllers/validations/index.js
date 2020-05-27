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
      generateError("This field can not be longer than 50 characters.", 400)
    ),
  lastName: Joi.string()
    .max(50)
    .error(
      generateError("This field can not be longer than 50 characters.", 400)
    ),
});

////Edit password/////////
const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

//////
//Shop//////////
const shopSchema = Joi.object().keys({
  name: Joi.string()
    .max(100)
    .error(
      generateError("This field can not be longer than 100 characters.", 400)
    ),
  description: Joi.string()
    .max(500)
    .error(
      generateError("This field can not be longer than 500 characters.", 400)
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
    .error(
      generateError("This field can not be longer than 100 characters.", 400)
    ),
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
    .error(generateError(`You must select a valid option.`, 400)),
  type: Joi.string()
    .valid("available", "custom")
    .default("ready")
    .error(generateError(`You must select a valid option.`, 400)),
  description: Joi.string()
    .max(500)
    .error(
      generateError("This field can not be longer than 500 characters.", 400)
    ),
  color: Joi.array()
    .items(
      Joi.string()
        .valid(...colors)
        .default("other")
    )
    .unique()
    .required()
    .error(generateError(`You must select one or more valid options.`, 400)),
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

//Search//////////////////////
const searchSchema = Joi.object().keys({
  category: Joi.string()
    .valid(...categories)
    .error(generateError(`Must select a correct category.`, 400)),
  words: Joi.string()
    .max(100)
    .error(
      generateError("This field can not be longer than 100 characters.", 400)
    ),
  priceMax: Joi.number()
    .positive()
    .max(99999)
    .default(99999)
    .error(
      generateError(
        `You must set a price. It can be more than 99999 nor have more than two decimals.`,
        400
      )
    ),
  priceMin: Joi.number()
    .positive()
    .precision(2)
    .default(0)
    .max(99999)
    .error(
      generateError(
        `You must set a price. It can be more than 99999 nor have more than two decimals.`,
        400
      )
    ),
  type: Joi.string()
    .valid("available", "custom")
    .error(generateError(`You must select a valid option.`, 400)),
  color: Joi.array()
    .items(Joi.string().valid(...colors))
    .unique()
    .error(generateError(`You must select one or more valid options.`, 400)),
  avgRating: Joi.number()
    .positive()
    .precision(1)
    .max(5)
    .error(generateError(`You must vote with up to 5 points.`, 400)),
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
  searchSchema,
};
