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
exports.changeTeamStatusHandler = exports.updateTeamHandler = exports.readOneTeamHandler = exports.readAllTeamHandler = exports.createTeamHandler = void 0;
var lodash_1 = require("lodash");
var logger_1 = __importDefault(require("../logger"));
var team_service_1 = require("../service/team.service");
var toBoolean_1 = require("../utils/toBoolean");
function createTeamHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var teamName, team, inserted, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    teamName = lodash_1.get(req.body, "name");
                    return [4 /*yield*/, team_service_1.findTeam({ name: teamName })];
                case 1:
                    team = _a.sent();
                    if (team)
                        return [2 /*return*/, res.status(409).send({
                                message: "Team Name is already exist try another one!",
                            })];
                    return [4 /*yield*/, team_service_1.createTeam(req.body)];
                case 2:
                    inserted = _a.sent();
                    return [2 /*return*/, res.send(inserted)];
                case 3:
                    e_1 = _a.sent();
                    logger_1.default.error(e_1);
                    return [2 /*return*/, res.send(e_1.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createTeamHandler = createTeamHandler;
function readAllTeamHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var page, limit, sort, search, status_1, isActive, teams, e_2;
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
                    return [4 /*yield*/, team_service_1.findAllTeam(page, limit, sort, search, isActive)];
                case 1:
                    teams = _a.sent();
                    return [2 /*return*/, res.send(teams)];
                case 2:
                    e_2 = _a.sent();
                    logger_1.default.error(e_2);
                    return [2 /*return*/, res.send(e_2.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readAllTeamHandler = readAllTeamHandler;
function readOneTeamHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, isExist, team, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, team_service_1.findTeam({ _id: id })];
                case 1:
                    isExist = _a.sent();
                    if (!isExist)
                        res.status(404).send({ message: "No team Found!" });
                    return [4 /*yield*/, team_service_1.findTeamAggregate(id)];
                case 2:
                    team = _a.sent();
                    return [2 /*return*/, res.send(team)];
                case 3:
                    e_3 = _a.sent();
                    logger_1.default.error(e_3);
                    return [2 /*return*/, res.send(e_3.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.readOneTeamHandler = readOneTeamHandler;
function updateTeamHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, team, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, team_service_1.findTeamAndUpdate({ _id: id }, req.body, { new: true })];
                case 1:
                    team = _a.sent();
                    if (!team)
                        return [2 /*return*/, false];
                    return [2 /*return*/, res.send(team)];
                case 2:
                    e_4 = _a.sent();
                    logger_1.default.error(e_4);
                    return [2 /*return*/, res.send(e_4.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateTeamHandler = updateTeamHandler;
function changeTeamStatusHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, isExist, team, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, team_service_1.findTeam({ _id: id })];
                case 1:
                    isExist = _a.sent();
                    if (!isExist)
                        return [2 /*return*/, res.status(404).send({ message: "No team found!" })];
                    return [4 /*yield*/, team_service_1.findTeamAndUpdate({ _id: id }, req.body, { new: true })];
                case 2:
                    team = _a.sent();
                    return [2 /*return*/, res.send(team)];
                case 3:
                    e_5 = _a.sent();
                    logger_1.default.error(e_5);
                    return [2 /*return*/, res.send(e_5.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.changeTeamStatusHandler = changeTeamStatusHandler;
