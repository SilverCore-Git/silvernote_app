const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.secret_token_key;

class token {

    create(data = {}) {
        return jwt.sign(data, secretKey, { expiresIn: '24h' } );
    };

    verify(token) {
        return jwt.verify(token, secretKey);
    };

};

module.exports = new token();