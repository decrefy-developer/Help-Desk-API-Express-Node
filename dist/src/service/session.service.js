"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.findSessions = exports.updateSession = exports.reIssueAccessToken = exports.createAccessToken = exports.createSession = void 0;
var lodash_1 = require("lodash");
var config_1 = __importDefault(require("config"));
var session_model_1 = __importDefault(require("../model/session.model"));
var jwt_utils_1 = require("../utils/jwt.utils");
var user_service_1 = require("./user.service");
function createSession(userId, userAgent) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, session_model_1.default.create({ user: userId, userAgent: userAgent })];
                case 1:
                    session = _a.sent();
                    return [2 /*return*/, session.toJSON()];
            }
        });
    });
}
exports.createSession = createSession;
function createAccessToken(_a) {
    var user = _a.user, session = _a.session;
    //build and return the new access token
    var accessToken = jwt_utils_1.sign(__assign(__assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") });
    return accessToken;
}
exports.createAccessToken = createAccessToken;
function reIssueAccessToken(_a) {
    var refreshToken = _a.refreshToken;
    return __awaiter(this, void 0, void 0, function () {
        var decoded, session, userSession, user, accessToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, jwt_utils_1.decode(refreshToken)];
                case 1:
                    decoded = (_b.sent()).decoded;
                    if (!decoded || !lodash_1.get(decoded, "_id"))
                        return [2 /*return*/, false];
                    return [4 /*yield*/, session_model_1.default.findById(lodash_1.get(decoded, "_id"))];
                case 2:
                    session = _b.sent();
                    // Make sure the session is still valid
                    if (!session || !(session === null || session === void 0 ? void 0 : session.valid))
                        return [2 /*return*/, false];
                    return [4 /*yield*/, user_service_1.findUser({ _id: session.user })];
                case 3:
                    userSession = _b.sent();
                    if (!userSession)
                        return [2 /*return*/, false];
                    user = lodash_1.omit(userSession.toJSON(), "password");
                    accessToken = createAccessToken({ user: user, session: session });
                    return [2 /*return*/, accessToken];
            }
        });
    });
}
exports.reIssueAccessToken = reIssueAccessToken;
function updateSession(query, update) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, session_model_1.default.updateOne(query, update)];
        });
    });
}
exports.updateSession = updateSession;
function findSessions(query) {
    return __awaiter(this, void 0, void 0, function () {
        var sessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, session_model_1.default.find(query).lean()];
                case 1:
                    sessions = _a.sent();
                    return [2 /*return*/, sessions];
            }
        });
    });
}
exports.findSessions = findSessions;
