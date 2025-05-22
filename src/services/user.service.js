const User = require("../models/user.model");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
    return await User.findOne({
        where: {
            username: username
        }
    });
};

/**
 * Get user by id
 * @param {number} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
    return await User.findOne({
        where: {
            id: userId
        }
    });
};

const createUser = async (userBody) => {
    if (await User.findOne({
        where:{
            username:userBody.username
        }
    })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
};

module.exports = {
    getUserById,
    getUserByUsername,
    createUser
}