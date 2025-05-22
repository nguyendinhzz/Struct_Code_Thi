const { sequelize } = require("../sequelize");
const { DataTypes } = require("sequelize");
const bcrypt = require('bcryptjs');

const User = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(50),
    allowNull:false
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  changeinfo_time: {
    type: DataTypes.DATE,
    allowNull: true
  }
},{
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      // Set initial changeinfo_time
      user.changeinfo_time = new Date();
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') || user.changed('full_name') || user.changed('username')) {
        // Update changeinfo_time when user information is updated
        user.changeinfo_time = new Date();
      }
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to check if password matches
User.prototype.isPasswordMatch = async function(password) {
  if (!password || !this.password) {
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
