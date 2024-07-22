const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    API_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL
} = process.env;