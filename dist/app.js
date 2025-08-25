"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const token_1 = __importDefault(require("./assets/ts/token"));
require("dotenv/config");
const config_json_1 = __importDefault(require("./config.json"));
const app = (0, express_1.default)();
const PORT = config_json_1.default.PORT;
// Middlewares
//app.use(clerkMiddleware())
app.use((0, cors_1.default)(config_json_1.default.corsOptions));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SIGN_KEY));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
    try {
        let token = req.cookies.api_token;
        if (!token) {
            token = await token_1.default.create();
            res.cookie('api_token', token, { maxAge: 12 * 60 * 3600 * 100, httpOnly: true });
        }
        const verify = await token_1.default.verify(token);
        if (!verify) {
            token = await token_1.default.create();
            res.cookie('api_token', token, { maxAge: 12 * 60 * 3600 * 100, httpOnly: true });
        }
        next();
    }
    catch (err) {
        res.status(500).json({ error: true, message: err });
        return;
    }
});
// Import routes
const api_1 = __importDefault(require("./routes/api"));
const api_db_1 = __importDefault(require("./routes/api.db"));
const api_ai_1 = __importDefault(require("./routes/api.ai"));
const user_1 = __importDefault(require("./routes/user"));
const money_1 = __importDefault(require("./routes/money"));
app.use('/api', api_1.default);
app.use('/api/ai', api_ai_1.default);
app.use('/api/db', api_db_1.default);
app.use('/user', user_1.default);
app.use('/money', money_1.default);
// err 404
app.use((req, res) => {
    res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});
// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
