'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Blog extends Model {
    static associate(models) {
        Blog.belongsTo(models.user, {
            as: 'posts',
            foreignKey:'userId'
         })
    }
  }
  Blog.init({
    id:{ type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
    title: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
    tags:{type: DataTypes.ARRAY(DataTypes.STRING)},
    status: {
      type: DataTypes.ENUM("Draft", "Published", "Deleted"),
      defaultValue: "Draft",
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        referrences: {
          model: 'User',
          key: 'id'
        },
      },
  }, {
    sequelize,
    modelName: 'blog',
    tableName: 'blog'
  });
  return Blog;
};