"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelUserHandler = exports.teamUserHandler = exports.changeUserStatusHandler = exports.readUserHanlder = exports.readAllUserHandler = exports.resetPasswordHandler = exports.updateUserHandler = exports.createUserHandler = void 0;
var lodash_1 = require("lodash");
var user_service_1 = require("../service/user.service");
var logger_1 = __importDefault(require("../logger"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var config_1 = __importDefault(require("config"));
var toBoolean_1 = require("../utils/toBoolean");
var channel_service_1 = require("../service/channel.service");
var mongoose_1 = __importDefault(require("mongoose"));
var ObjectId = mongoose_1.default.Types.ObjectId;
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var email, user, inserted, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    email = lodash_1.get(req.body, "email");
                    return [4 /*yield*/, user_service_1.findUser({ email: email })];
                case 1:
                    user = _a.sent();
                    if (user)
                        return [2 /*return*/, res
                                .status(409)
                                .send({ message: "email is already exist! try again." })];
                    return [4 /*yield*/, user_service_1.createUser(req.body)];
                case 2:
                    inserted = _a.sent();
                    if (inserted)
                        return [2 /*return*/, res.send(lodash_1.omit(inserted.toJSON(), "password"))];
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    logger_1.default.error(e_1);
                    return [2 /*return*/, res.send(e_1.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createUserHandler = createUserHandler;
function updateUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, upadated, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, user_service_1.findUser({ _id: userId })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send({ message: "No user found!" })];
                    return [4 /*yield*/, user_service_1.findAndUpdate({ _id: userId }, req.body, {
                            new: true,
                        })];
                case 2:
                    upadated = _a.sent();
                    if (!upadated)
                        return [2 /*return*/, false];
                    return [2 /*return*/, res.send(lodash_1.omit(upadated.toJSON(), "password"))];
                case 3:
                    e_2 = _a.sent();
                    logger_1.default.error(e_2);
                    return [2 /*return*/, res.send(e_2.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateUserHandler = updateUserHandler;
function resetPasswordHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, resetPassword, salt, hashPassword, upadated, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    userId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, user_service_1.findUser({ _id: userId })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send({ message: "No user found!" })];
                    resetPassword = "123456";
                    return [4 /*yield*/, bcrypt_1.default.genSalt(config_1.default.get("saltWorkFactor"))];
                case 2:
                    salt = _a.sent();
                    return [4 /*yield*/, bcrypt_1.default.hashSync(resetPassword, salt)];
                case 3:
                    hashPassword = _a.sent();
                    return [4 /*yield*/, user_service_1.findAndUpdate({ _id: userId }, { password: hashPassword }, {
                            new: true,
                        })];
                case 4:
                    upadated = _a.sent();
                    if (!upadated)
                        return [2 /*return*/, false];
                    return [2 /*return*/, res.send(lodash_1.omit(upadated.toJSON(), "password"))];
                case 5:
                    e_3 = _a.sent();
                    logger_1.default.error(e_3);
                    return [2 /*return*/, res.send(e_3.message)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.resetPasswordHandler = resetPasswordHandler;
function readAllUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var page, limit, sort, search, status_1, isActive, users, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    page = lodash_1.get(req, "query.page");
                    limit = lodash_1.get(req, "query.limit");
                    sort = lodash_1.get(req, "query.sort");
                    search = lodash_1.get(req, "query.search");
                    status_1 = lodash_1.get(req, "query.status");
                    if (search !== "")
                        page = 1; // change back the page into 1
                    isActive = toBoolean_1.ToBoolean(status_1);
                    return [4 /*yield*/, user_service_1.findAllUser(page, limit, sort, search, isActive)];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, res.send(users)];
                case 2:
                    e_4 = _a.sent();
                    logger_1.default.error(e_4);
                    return [2 /*return*/, res.send(e_4.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readAllUserHandler = readAllUserHandler;
function readUserHanlder(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, user_service_1.findUser({ _id: userId })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send({ message: "No user found!" })];
                    return [2 /*return*/, res.send(user)];
                case 2:
                    e_5 = _a.sent();
                    logger_1.default.error(e_5);
                    return [2 /*return*/, res.send(e_5.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readUserHanlder = readUserHanlder;
function changeUserStatusHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, updated, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, user_service_1.findUser({ _id: userId })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send({ message: "No user found!" })];
                    return [4 /*yield*/, user_service_1.findAndUpdate({ _id: userId }, req.body, {
                            new: true,
                        })];
                case 2:
                    updated = _a.sent();
                    return [2 /*return*/, res.send(updated)];
                case 3:
                    e_6 = _a.sent();
                    logger_1.default.error(e_6);
                    return [2 /*return*/, res.send(e_6.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.changeUserStatusHandler = changeUserStatusHandler;
function teamUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, result, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, user_service_1.findUser({ _id: userId })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send({ message: "No user found!" })];
                    return [4 /*yield*/, user_service_1.findChannelsOfTheUser(userId, user === null || user === void 0 ? void 0 : user.priviledge)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, res.send(result)];
                case 3:
                    e_7 = _a.sent();
                    logger_1.default.error(e_7);
                    return [2 /*return*/, res.send(e_7.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.teamUserHandler = teamUserHandler;
function channelUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId_1, channelId, user, result, getUser, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId_1 = lodash_1.get(req, "query.userId");
                    channelId = lodash_1.get(req, "query.channelId");
                    return [4 /*yield*/, user_service_1.findUser({ _id: userId_1 })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send({ message: "No user found!" })];
                    return [4 /*yield*/, channel_service_1.findChannel({ _id: channelId })];
                case 2:
                    result = _a.sent();
                    getUser = result === null || result === void 0 ? void 0 : result.members.filter(function (item) { return item.userId == userId_1; });
                    return [2 /*return*/, res.send(getUser[0])];
                case 3:
                    e_8 = _a.sent();
                    logger_1.default.error(e_8);
                    return [2 /*return*/, res.send(e_8.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.channelUserHandler = channelUserHandler;
