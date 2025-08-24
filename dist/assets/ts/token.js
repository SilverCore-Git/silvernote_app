"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secret_token_key;
class token {
    create(data = {}) {
        return jwt.sign(data, secretKey, { expiresIn: '12h' });
    }
    ;
    verify(token) {
        return jwt.verify(token, secretKey);
    }
    ;
}
;
exports.default = new token();
