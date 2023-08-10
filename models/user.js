'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.blog, {
        as: 'posts',
        foreignKey: 'userId'
    })
    }
  }
  User.init({
    id:{type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull:false, unique:true, isEmail: true},
    password: { type: DataTypes.STRING },
    role: {
      type: DataTypes.ENUM("Admin", "Reviewer", "Author"),
      defaultValue: "Author",
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user'
  });
  return User;
};