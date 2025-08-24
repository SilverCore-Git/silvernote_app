const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey: string | undefined = process.env.secret_token_key;

class token {

    create(data = {}): string {
        return jwt.sign(data, secretKey, { expiresIn: '12h' } );
    };

    verify(token: string): any {
        return jwt.verify(token, secretKey);
    };

};

export default new token();