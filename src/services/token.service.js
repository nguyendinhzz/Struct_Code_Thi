const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const User = require("../models/user.model");

const ApiError = require('../utils/ApiError');

require("dotenv").config();
const tokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh'
  };
const { v4: uuidv4 } = require('uuid'); // thêm dòng này

const generateToken = (userId, expires, type, secret = process.env.JWT_REFRESH_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    jti: uuidv4(), // thêm ID ngẫu nhiên để token không bao giờ trùng
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify token and return user doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<User>}
 */
const verifyToken = async (token, type) => {
  try {
    let secret = process.env.JWT_REFRESH_SECRET;
    if (type === tokenTypes.ACCESS) {
      secret = process.env.JWT_SECRET;
    }
    
    const payload = jwt.verify(token, secret);
    const user = await User.findByPk(payload.sub);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    if (type === tokenTypes.REFRESH && user.refresh_token !== token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    return user;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token verification failed');
  }
};

/**
 * Save refresh token to user
 * @param {string} token
 * @param {number} userId
 * @returns {Promise<void>}
 */
const saveToken = async (token, userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if this token is already in use by another user
  const existingUser = await User.findOne({ where: { refresh_token: token } });
  if (existingUser && existingUser.id !== userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token already in use');
  }

  user.refresh_token = token;
  await user.save();
  return user;
};

/**
 * Generate access and refresh tokens for a user
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(7, 'days');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS, process.env.JWT_SECRET);

  const refreshTokenExpires = moment().add(30, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH, process.env.JWT_REFRESH_SECRET);
  await saveToken(refreshToken, user.id);

  return {
    access: accessToken,
    refresh:refreshToken
  };
};

/**
 * Invalidate all tokens for a user by clearing their refresh token
 * @param {number} userId
 * @returns {Promise<void>}
 */
const invalidateUserTokens = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  // Cập nhật changeinfo_time và xóa refresh_token
  user.refresh_token = null;
  user.changeinfo_time = new Date();
  await user.save();
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  invalidateUserTokens,
};
