const Joi = require('joi');

const registerValidator = {
  body: Joi.object({
    full_name: Joi.string().min(6).max(225).required(),
    username: Joi.string().min(6).max(225).required(),
    password: Joi.string().min(6).max(225).pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
  })
};

const loginValidator = {
  body: Joi.object({
    username: Joi.string().min(6).max(225).required(),
    password: Joi.string().min(6).max(225).pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const changePass = {
  body: Joi.object({
    oldPassword: Joi.string().min(6).max(225).pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
    newPassword: Joi.string().min(6).max(225).pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required()
      .disallow(Joi.ref('oldPassword')).messages({
        'any.only': 'Mật khẩu mới phải khác mật khẩu cũ',
      }),
    full_name: Joi.string().min(6).max(225).required(),
  })
};

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokens,
  changePass,
};