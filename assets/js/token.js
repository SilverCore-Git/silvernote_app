const jwt = require('jsonwebtoken');

class token {

    create(data = {}) {
        return jwt.sign(data, secretKey, { expiresIn: '24h' } );
    };

};

module.exports = new token();