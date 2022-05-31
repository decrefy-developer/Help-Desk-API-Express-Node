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
exports.getAllTransferTicketHandler = exports.updateTransferTicketHandler = exports.reportsHandler = exports.updateFillingHandler = exports.updateTargetDateHandler = exports.fillingTicketHandler = exports.getRequestTransferHandler = exports.createTransferRequestHandler = exports.updateTicketSeenHandler = exports.readAllNotSeenTickethandler = exports.readTicketSchemaHandler = exports.readAllTicketHandler = exports.updateTicketHandler = exports.createTicketHandler = void 0;
var lodash_1 = require("lodash");
var moment_1 = __importDefault(require("moment"));
var logger_1 = __importDefault(require("../logger"));
var ticket_model_1 = __importDefault(require("../model/ticket.model"));
var channel_service_1 = require("../service/channel.service");
var ticket_service_1 = require("../service/ticket.service");
var mongoose_1 = __importDefault(require("mongoose"));
var toBoolean_1 = require("../utils/toBoolean");
var transferredTicket_model_1 = __importDefault(require("../model/transferredTicket.model"));
var dateNow = moment_1.default().toISOString();
var ObjectId = mongoose_1.default.Types.ObjectId;
function createTicketHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var newTicket, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ticket_service_1.createTicket(req.body)];
                case 1:
                    newTicket = _a.sent();
                    return [2 /*return*/, res.send(newTicket)];
                case 2:
                    error_1 = _a.sent();
                    logger_1.default.error(error_1);
                    return [2 /*return*/, res.send(error_1.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createTicketHandler = createTicketHandler;
function updateTicketHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, body, id, mode, ticket, updated, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    request = req;
                    body = void 0;
                    id = lodash_1.get(req, "params.id");
                    mode = lodash_1.get(req, "body.mode");
                    return [4 /*yield*/, ticket_service_1.findTicket({ _id: id })];
                case 1:
                    ticket = _a.sent();
                    if (!ticket)
                        return [2 /*return*/, res.send({ message: "No ticket found!" })];
                    if (mode === "DONE TICKET") {
                        body = {
                            state: "DONE",
                            solution: req.body.solution,
                            doneDate: dateNow,
                            categoryId: req.body.categoryId,
                            SubCategoryId: req.body.SubCategoryId
                        };
                    }
                    else if (mode === "CLOSING TICKET") {
                        body = {
                            status: "CLOSED",
                            closedDate: dateNow,
                            closedBy: request.user._id
                        };
                    }
                    else if (mode === "CANCELLING TICKET") {
                        body = {
                            status: "CANCELLED",
                            closedDate: dateNow,
                            state: "DONE",
                            doneDate: dateNow,
                        };
                    }
                    return [4 /*yield*/, ticket_service_1.findTicketAndUpdate({ _id: id }, body, {
                            new: true,
                        })];
                case 2:
                    updated = _a.sent();
                    return [2 /*return*/, res.send(updated)];
                case 3:
                    error_2 = _a.sent();
                    logger_1.default.error(error_2);
                    return [2 /*return*/, res.send(error_2.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateTicketHandler = updateTicketHandler;
function readAllTicketHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var page, limit, sort, search, channelId, state, status_1, user, tickets, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    page = lodash_1.get(req, "query.page");
                    limit = lodash_1.get(req, "query.limit");
                    sort = lodash_1.get(req, "query.sort");
                    search = lodash_1.get(req, "query.search");
                    channelId = lodash_1.get(req, "query.channelId");
                    state = lodash_1.get(req, "query.state");
                    status_1 = lodash_1.get(req, "query.status");
                    return [4 /*yield*/, getUserandRole(req, channelId)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, ticket_service_1.findAllTicketsAggre(page, limit, sort, search, channelId, user, state, status_1)];
                case 2:
                    tickets = _a.sent();
                    return [2 /*return*/, res.send(tickets)];
                case 3:
                    error_3 = _a.sent();
                    logger_1.default.error(error_3);
                    return [2 /*return*/, res.send(error_3.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.readAllTicketHandler = readAllTicketHandler;
function readTicketSchemaHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var requestId, ticket, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    requestId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, ticket_service_1.findTicketAggregate(requestId)];
                case 1:
                    ticket = _a.sent();
                    if (!ticket) {
                        return [2 /*return*/, res.send({ message: "no request ID found" })];
                    }
                    return [2 /*return*/, res.send(ticket[0])];
                case 2:
                    error_4 = _a.sent();
                    logger_1.default.error(error_4);
                    return [2 /*return*/, res.send(error_4.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readTicketSchemaHandler = readTicketSchemaHandler;
function readAllNotSeenTickethandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, tickets, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, ticket_model_1.default.aggregate([{ $match: { $and: [{ seen: false }, { userId: ObjectId(userId) }] } }, { $group: { _id: "$channelId", count: { $sum: 1 } } }])];
                case 1:
                    tickets = _a.sent();
                    return [2 /*return*/, res.send(tickets)];
                case 2:
                    error_5 = _a.sent();
                    logger_1.default.error(error_5);
                    return [2 /*return*/, res.send(error_5.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readAllNotSeenTickethandler = readAllNotSeenTickethandler;
function updateTicketSeenHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, ticket, updated, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, ticket_service_1.findTicket({ _id: id })];
                case 1:
                    ticket = _a.sent();
                    if (!ticket)
                        return [2 /*return*/, res.send({ message: "No ticket found!" })];
                    return [4 /*yield*/, ticket_service_1.findTicketAndUpdate({ _id: id }, { seen: true }, {
                            new: true,
                        })];
                case 2:
                    updated = _a.sent();
                    return [2 /*return*/, res.send(updated)];
                case 3:
                    error_6 = _a.sent();
                    logger_1.default.error(error_6);
                    return [2 /*return*/, res.send(error_6.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateTicketSeenHandler = updateTicketSeenHandler;
function getUserandRole(req, channelId) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, request, channel, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accessToken = lodash_1.get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
                    request = req;
                    return [4 /*yield*/, channel_service_1.findChannel({ _id: channelId })];
                case 1:
                    channel = _a.sent();
                    console.log('hello');
                    user = channel === null || channel === void 0 ? void 0 : channel.members.filter(function (member) { var _a; return member.userId == ((_a = request.user) === null || _a === void 0 ? void 0 : _a._id); });
                    if (!user) {
                        return [2 /*return*/, {
                                userId: "",
                                email: "",
                                isAdmin: true,
                            }];
                    }
                    if ((user === null || user === void 0 ? void 0 : user.length) == 0) {
                        return [2 /*return*/, {
                                userId: "",
                                email: "",
                                isAdmin: true,
                            }];
                    }
                    return [2 /*return*/, user[0]];
            }
        });
    });
}
function createTransferRequestHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var ticketId, ticketNumber, ticket, isTicketNumberExist, description, from, to, remarks, inserted, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    ticketId = lodash_1.get(req, "body.ticketId");
                    ticketNumber = lodash_1.get(req, "body.ticketNumber");
                    return [4 /*yield*/, ticket_service_1.findTicket({ _id: ticketId })];
                case 1:
                    ticket = _a.sent();
                    if (!ticket)
                        return [2 /*return*/, res.status(404).send({ message: "No ticket found!" })];
                    return [4 /*yield*/, ticket_service_1.findTransferTicket({ ticketNumber: ticketNumber, isApproved: false })];
                case 2:
                    isTicketNumberExist = _a.sent();
                    if (isTicketNumberExist)
                        return [2 /*return*/, res.status(409).send({ message: "This ticket is already requested" })];
                    description = lodash_1.get(req, "body.description");
                    from = lodash_1.get(req, "body.from");
                    to = lodash_1.get(req, "body.to");
                    remarks = lodash_1.get(req, "body.remarks");
                    return [4 /*yield*/, ticket_service_1.createTransferTicket({ ticketId: ticketId, ticketNumber: ticketNumber, description: description, from: from, to: to, remarks: remarks })];
                case 3:
                    inserted = _a.sent();
                    return [2 /*return*/, res.send(inserted)];
                case 4:
                    error_7 = _a.sent();
                    logger_1.default.error(error_7);
                    return [2 /*return*/, res.send(error_7.message)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createTransferRequestHandler = createTransferRequestHandler;
function getRequestTransferHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _id, result, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    _id = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, ticket_service_1.findTransferTicketAggregate(_id)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, res.send(result)];
                case 2:
                    error_8 = _a.sent();
                    logger_1.default.error(error_8);
                    return [2 /*return*/, res.send(error_8.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getRequestTransferHandler = getRequestTransferHandler;
// export async function transferringTicketHandler(req: Request, res: Response) {
//   try {
//     const id = get(req, "params.id");
//     const pushTagQuery = { $push: { tags: "TRANSFERRING" } }; // push the tranferring to tags field
//     const ticket = await findTicket({ _id: id });
//     if (!ticket) return res.send({ message: "No ticket found!" }); // check the ticket if exists
//     const ticketId = id;
//     const ticketNumber = get(ticket, "ticketNumber");
//     const requestedBy = get(req, "user._id");
//     const targetDate = get(ticket, "targetDate");
//     const description = get(ticket, "description");
//     // check is the ticket is already transferred
//     const isExist = await findTransferredTicket({ ticketNumber });
//     if (isExist)
//       return res.send({
//         message: "The ticket is already submitted as transfer",
//       });
//     //updated the tags of ticket
//     const updated = await findTicketAndUpdate({ _id: id }, pushTagQuery, {
//       new: true,
//     });
//     if (!updated)
//       return res.send({
//         message: "something went wrong during transferring of ticket",
//       });
//     const transferDetails = {
//       ticketId,
//       ticketNumber,
//       description,
//       requestedBy,
//       targetDate,
//     };
//     const transferredTicket = await rquestTransferTicket(transferDetails);
//     return res.send(transferredTicket);
//   } catch (error: any) {
//     log.error(error);
//     return res.send(error.message);
//   }
// }
// export async function doneTransferringTicketHandler(
//   req: Request,
//   res: Response
// ) {
//   try {
//     const id = get(req, "params.id");
//     const tansferredTicket = await findTransferredTicket({ _id: id });
//     if (!tansferredTicket) return res.send({ message: "No data found!" });
//     // update the ticket on transfer to "DONE TRUE"
//     const updatedTransfer = await findTransferredAndUpdate(
//       {
//         ticketNumber: tansferredTicket.ticketNumber,
//       },
//       { isDone: true },
//       { new: true }
//     );
//     if (!updatedTransfer)
//       return res.send({
//         message: "something went wrong during closing of transfer",
//       });
//     const updatedTicket = await findTicketAndUpdate(
//       {
//         _id: tansferredTicket.ticketId,
//       },
//       req.body,
//       { new: true }
//     );
//     return res.send(updatedTicket);
//   } catch (error: any) {
//     log.error(error);
//     return res.send(error.message);
//   }
// }
function fillingTicketHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var page, limit, sort, search, channelId, departmentId, state, status_2, isFiled, tickets, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    page = lodash_1.get(req, "query.page");
                    limit = lodash_1.get(req, "query.limit");
                    sort = lodash_1.get(req, "query.sort");
                    search = lodash_1.get(req, "query.search");
                    channelId = lodash_1.get(req, "query.channelId");
                    departmentId = lodash_1.get(req, "query.departmentId");
                    state = lodash_1.get(req, "query.state");
                    status_2 = lodash_1.get(req, "query.status");
                    isFiled = toBoolean_1.ToBoolean(lodash_1.get(req, "query.isFiled"));
                    return [4 /*yield*/, ticket_service_1.findFillingTicketsAggre(page, limit, sort, search, channelId, departmentId, state, status_2, isFiled)];
                case 1:
                    tickets = _a.sent();
                    return [2 /*return*/, res.send(tickets)];
                case 2:
                    error_9 = _a.sent();
                    logger_1.default.error(error_9);
                    return [2 /*return*/, res.send(error_9.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.fillingTicketHandler = fillingTicketHandler;
function updateTargetDateHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, isTicketExist, updated, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = lodash_1.get(req, "params.id");
                    return [4 /*yield*/, ticket_service_1.findTicket({ _id: id })];
                case 1:
                    isTicketExist = _a.sent();
                    if (!isTicketExist)
                        return [2 /*return*/, res.send({ message: "no ticket found!" })];
                    return [4 /*yield*/, ticket_service_1.findTicketAndUpdate({ _id: id }, req.body, {
                            new: true,
                        })];
                case 2:
                    updated = _a.sent();
                    return [2 /*return*/, res.send(updated)];
                case 3:
                    error_10 = _a.sent();
                    logger_1.default.error(error_10);
                    return [2 /*return*/, res.send(error_10.message)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateTargetDateHandler = updateTargetDateHandler;
function updateFillingHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, multipleUpdate, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = lodash_1.get(req, 'body.ticketId');
                    return [4 /*yield*/, ticket_service_1.bulkUpdatea({ _id: { $in: id } }, { $set: { isFiled: true, DateFiled: dateNow } }, { multi: true, new: true })];
                case 1:
                    multipleUpdate = _a.sent();
                    return [2 /*return*/, res.send(multipleUpdate)];
                case 2:
                    error_11 = _a.sent();
                    logger_1.default.error(error_11);
                    return [2 /*return*/, res.send(error_11.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateFillingHandler = updateFillingHandler;
function reportsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var openDate, closedDate, team, channel, status_3, tickets, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    openDate = lodash_1.get(req, "query.openDate");
                    closedDate = lodash_1.get(req, "query.closedDate");
                    team = lodash_1.get(req, "query.team");
                    channel = lodash_1.get(req, "query.channel");
                    status_3 = lodash_1.get(req, "query.status");
                    return [4 /*yield*/, ticket_service_1.reports(openDate, closedDate, team, channel, status_3)];
                case 1:
                    tickets = _a.sent();
                    return [2 /*return*/, res.send(tickets)];
                case 2:
                    error_12 = _a.sent();
                    logger_1.default.error(error_12);
                    return [2 /*return*/, res.send(error_12.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.reportsHandler = reportsHandler;
function updateTransferTicketHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, mode, channelId, userId, updateTransfer, ticketId, to, updateTicket, deleted, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    id = lodash_1.get(req, "params.id");
                    mode = lodash_1.get(req, "body.mode");
                    channelId = lodash_1.get(req, "body.channelId");
                    userId = lodash_1.get(req, "body.userId");
                    if (!(mode === "APPROVE")) return [3 /*break*/, 4];
                    return [4 /*yield*/, ticket_service_1.findTransferAndUpdate({ _id: id }, {
                            $set: {
                                isApproved: true, dateApproved: dateNow, "to.channelId": channelId
                            }
                        }, { new: true })];
                case 1:
                    updateTransfer = _a.sent();
                    if (!updateTransfer) return [3 /*break*/, 3];
                    ticketId = updateTransfer.ticketId, to = updateTransfer.to;
                    return [4 /*yield*/, ticket_service_1.findTicketAndUpdate({ _id: ticketId }, { $set: { teamId: to.teamId, channelId: to.channelId, userId: userId, }, $push: { tags: "TRANSFERRED" } }, { new: true })];
                case 2:
                    updateTicket = _a.sent();
                    return [2 /*return*/, res.send(updateTransfer)];
                case 3: return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, transferredTicket_model_1.default.findOneAndRemove({ _id: id })];
                case 5:
                    deleted = _a.sent();
                    return [2 /*return*/, res.send(deleted)];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_13 = _a.sent();
                    logger_1.default.error(error_13);
                    return [2 /*return*/, res.send(error_13.message)];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.updateTransferTicketHandler = updateTransferTicketHandler;
function getAllTransferTicketHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var teamId, isApproved, transfer, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    teamId = lodash_1.get(req, "query.team");
                    isApproved = lodash_1.get(req, "query.isApproved");
                    return [4 /*yield*/, ticket_service_1.findAllTransferTicketAggregate(teamId, isApproved)];
                case 1:
                    transfer = _a.sent();
                    return [2 /*return*/, res.send(transfer)];
                case 2:
                    error_14 = _a.sent();
                    logger_1.default.error(error_14);
                    return [2 /*return*/, res.send(error_14.message)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllTransferTicketHandler = getAllTransferTicketHandler;
