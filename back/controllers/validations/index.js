const Joi = require("@hapi/joi");
const JoiAge = Joi.extend(require("joi-age"));

const { generateError } = require("../../helpers");

//General schemas
const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError("Invalid email.", 400));

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

//Users
////Registration
const registerUserSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
  birthDate: JoiAge.date()
    .minAge(16)
    .maxAge(120)
    .required()
    .error(generateError("Must be older than 16 years old to register.", 400)),
});

const loginUserSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
});

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

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

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

module.exports = {
  emailSchema,
  registerUserSchema,
  loginUserSchema,
  editUserSchema,
  editPasswordUserSchema,
  shopSchema,
};
