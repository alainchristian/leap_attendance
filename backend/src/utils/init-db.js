const { Sequelize } = require('sequelize');
const config = require('../../config/config.json'); // Updated path
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function initializeDatabase() {
  // Create a temporary connection without specifying a database
  const sequelize = new Sequelize({
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    username: dbConfig.username,
    password: dbConfig.password
  });

  try {
    // Create database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);
    console.log('Database created or already exists');

    // Close the temporary connection
    await sequelize.close();
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Run if this script is called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;