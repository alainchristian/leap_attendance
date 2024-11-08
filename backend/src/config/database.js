
// backend/src/config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize({
  database: config.DATABASE.database,
  username: config.DATABASE.user,
  password: config.DATABASE.password,
  host: config.DATABASE.host,
  dialect: config.DATABASE.dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true // Enables soft delete
  }
});

module.exports = sequelize;