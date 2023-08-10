'use strict';

const { DataTypes } = require("sequelize")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.ENUM("Admin", "Reviewer", "Author"),
        defaultValue: "Author",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    await queryInterface.createTable('blog', {
      id: { type: DataTypes.INTEGER, autoIncrement: true,primaryKey: true },
      title: { type: DataTypes.TEXT },
      description: { type: DataTypes.TEXT },
      content: { type: DataTypes.TEXT },
      tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }

    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('blog');
  }
};