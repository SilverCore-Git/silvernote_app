"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_json_1 = __importDefault(require("./config.json"));
const app = (0, express_1.default)();
const PORT = config_json_1.default.PORT;
// Middlewares
app.use((0, cors_1.default)(config_json_1.default.corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public', 'index.html')));
// Import des routes
const api_1 = __importDefault(require("./routes/api"));
const user_1 = __importDefault(require("./routes/user"));
app.use('/', api_1.default);
app.use('/user', user_1.default);
// Middleware 404
app.use((req, res) => {
    res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});
// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
