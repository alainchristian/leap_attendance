
// backend/src/config/config.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  DATABASE: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'asyv_leap',
    dialect: 'mysql'
  },
  JWT: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRE || '24h'
  }
};