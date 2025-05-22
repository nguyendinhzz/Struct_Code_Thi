const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh',
  };
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUsernameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.refresh_token = null;
  await user.save();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const user = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const verifyAccessToken = async (token) => {
  if (!token) {
    console.log("No token provided");
    throw new ApiError(401, 'Access denied, token required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.sub } });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    if (!user.refresh_token) {
      throw new ApiError(401, 'User logged out or session expired');
    }
    
    if (user.changeinfo_time && decoded.iat < Math.floor(new Date(user.changeinfo_time).getTime() / 1000)) {
      throw new ApiError(401, 'User information has changed, please login again');
    }

    return decoded.sub;
  } catch (error) {
    throw new ApiError(403, 'Invalid token');
  }
};
module.exports = {
    loginUsernameAndPassword,
    logout,
    refreshAuth,
    verifyAccessToken
  };
  