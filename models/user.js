'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM("Admin", "Reviewer", "Author"),
      defaultValue: "Author",
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};