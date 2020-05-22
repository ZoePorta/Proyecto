const Joi = require("@hapi/joi");
const JoiAge = Joi.extend(require("joi-age"));

const { generateError } = require("../../helpers");

//Users
////Registration
const registerUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError("Invalid email.", 400)),
  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .error(
      generateError(
        "The password must contain more than 6 and less tahn 20 characters.",
        400
      )
    ),
  birthDate: JoiAge.date()
    .minAge(16)
    .maxAge(120)
    .required()
    .error(generateError("Must be older than 16 years old to register.", 400)),
});

const loginUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError("Invalid email.", 400)),
  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .error(
      generateError(
        "The password must contain more than 6 and less tahn 20 characters.",
        400
      )
    ),
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

module.exports = {
  registerUserSchema,
  loginUserSchema,
  editUserSchema,
};
