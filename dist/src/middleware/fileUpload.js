"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
var upload = multer_1.default({
    storage: storage,
    limits: { fieldSize: 1024 * 1024 * 3 },
}).single("pdf");
exports.default = upload;
