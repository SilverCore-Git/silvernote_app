"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
require("dotenv/config");
const config_json_1 = __importDefault(require("./config.json"));
// Import des routes
const api_1 = __importDefault(require("./routes/api"));
const api_db_1 = __importDefault(require("./routes/api.db"));
const api_ai_1 = __importDefault(require("./routes/api.ai"));
const user_1 = __importDefault(require("./routes/user"));
const money_1 = __importDefault(require("./routes/money"));
const app = (0, express_1.default)();
exports.httpServer = (0, http_1.createServer)(app);
require("./ws");
// Middlewares
app.use((0, cors_1.default)(config_json_1.default.corsOptions));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SIGN_KEY));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
app.use('/api', api_1.default);
app.use('/api/ai', api_ai_1.default);
app.use('/api/db', api_db_1.default);
app.use('/user', user_1.default);
app.use('/money', money_1.default);
// 404
app.use((req, res) => {
    res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});
// Démarrage serveur
exports.httpServer.listen(config_json_1.default.PORT, () => {
    console.log(`Serveur Express + WebSocket sur le port ${config_json_1.default.PORT}`);
});
