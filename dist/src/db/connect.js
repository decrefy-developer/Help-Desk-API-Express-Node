"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("config"));
var logger_1 = __importDefault(require("../logger"));
function connect() {
    var dbUri = config_1.default.get("dbUri");
    return mongoose_1.default
        .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
        .then(function () {
        logger_1.default.info("Database connected!");
    })
        .catch(function (err) {
        logger_1.default.error("db error", err);
        process.exit(1);
    });
}
exports.default = connect;
