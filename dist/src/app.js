"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("config"));
var cors_1 = __importDefault(require("cors"));
var logger_1 = __importDefault(require("./logger"));
var connect_1 = __importDefault(require("./db/connect"));
var routes_1 = __importDefault(require("./routes"));
var middleware_1 = require("./middleware");
var PORT = config_1.default.get("port");
var HOST = config_1.default.get("host");
var app = express_1.default();
app.use(cors_1.default());
app.use(middleware_1.deserializeUser);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.listen(PORT, HOST, function () {
    logger_1.default.info("server listing at " + HOST + ":" + PORT);
    connect_1.default();
    routes_1.default(app);
});
