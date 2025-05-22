const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    full_name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      full_name: Joi.string(),
    })
    .min(1),
};


module.exports = {
  createUser,
  deleteUser,
};
