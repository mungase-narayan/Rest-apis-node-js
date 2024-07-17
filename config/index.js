const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    API_PORT,
    DEBUG_MODE,
    DB_URL
} = process.env;