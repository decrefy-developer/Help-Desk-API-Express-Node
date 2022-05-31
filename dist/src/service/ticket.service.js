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
exports.findAllTransferTicketAggregate = exports.findTransferAndUpdate = exports.findTransferTicketAggregate = exports.findTransferTicket = exports.createTransferTicket = exports.bulkUpdatea = exports.getNextTicketId = exports.findTicketAndUpdate = exports.findTicket = exports.findTicketAggregate = exports.reports = exports.findFillingTicketsAggre = exports.findAllTicketsAggre = exports.createTicket = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var ticket_model_1 = __importDefault(require("../model/ticket.model"));
var transferredTicket_model_1 = __importDefault(require("../model/transferredTicket.model"));
var toBoolean_1 = require("../utils/toBoolean");
var ObjectId = mongoose_1.default.Types.ObjectId;
function createTicket(input) {
    return __awaiter(this, void 0, void 0, function () {
        var newTicket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ticket_model_1.default.create(input)];
                case 1:
                    newTicket = _a.sent();
                    return [2 /*return*/, newTicket];
            }
        });
    });
}
exports.createTicket = createTicket;
function findAllTicketsAggre(page, limit, sort, search, channelId, user, state, status) {
    if (limit === void 0) { limit = 10; }
    return __awaiter(this, void 0, void 0, function () {
        var options, stages, myAggregate, tickets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        page: page,
                        limit: limit,
                        sort: { name: sort ? -1 : 1, createdAt: -1 },
                    };
                    stages = [
                        {
                            $lookup: {
                                from: "departments",
                                let: { departmentId: "$departmentId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "department",
                            },
                        },
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "channel",
                            },
                        },
                        {
                            $lookup: {
                                from: "customers",
                                let: { customerId: "$customerId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$customerId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "customer",
                            },
                        },
                        {
                            $lookup: {
                                from: "categories",
                                let: { categoryId: "$categoryId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "category",
                            },
                        },
                        {
                            $lookup: {
                                from: "subcategories",
                                let: { subId: "$SubCategoryId" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$subId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "subCategory",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$userId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "user",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$createdBy" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "createdBy",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$closedBy" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "closedBy",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$coworkers" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "coworkers",
                            },
                        },
                        {
                            $lookup: {
                                from: "requests",
                                let: { requestId: "$requestId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$requestId"] } } },
                                    { $project: { userId: 1 } },
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: { userId: "$userId" },
                                            pipeline: [
                                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                                { $project: { firstName: 1, lastName: 1, departmentId: 1, email: 1 } },
                                                {
                                                    $lookup: {
                                                        from: "departments",
                                                        let: { departmentId: "$departmentId" },
                                                        pipeline: [
                                                            { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                                                            { $project: { name: 1 } },
                                                        ],
                                                        as: "department",
                                                    },
                                                },
                                                { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                                                { $unset: "departmentId" },
                                            ],
                                            as: "requester",
                                        },
                                    },
                                    { $unwind: { path: "$requester", preserveNullAndEmptyArrays: true } },
                                    { $unset: "userId" },
                                ],
                                as: "requestDetails",
                            },
                        },
                        { $unwind: { path: "$requestDetails", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$channel", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$closedBy", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                        { $unset: ["teamId", "channelId", "customerId", "categoryId", "userId", "SubCategoryId", "departmentId"] },
                        {
                            $match: {
                                $or: [
                                    { ticketNumber: { $regex: new RegExp(search), $options: "i" } },
                                    { "user.email": { $regex: new RegExp(search), $options: "i" } },
                                ],
                                "channel._id": ObjectId(channelId),
                                state: state,
                                status: status,
                            },
                        },
                    ];
                    if (user.isAdmin != true) {
                        stages.push({ $match: { "user._id": user.userId } });
                    }
                    myAggregate = ticket_model_1.default.aggregate(stages);
                    return [4 /*yield*/, ticket_model_1.default.aggregatePaginate(myAggregate, options, function (err, result) {
                            if (!err) {
                                return result;
                            }
                            else {
                                console.log(err);
                            }
                        })];
                case 1:
                    tickets = _a.sent();
                    return [2 /*return*/, tickets];
            }
        });
    });
}
exports.findAllTicketsAggre = findAllTicketsAggre;
function findFillingTicketsAggre(page, limit, sort, search, channelId, departmentId, state, status, isFiled) {
    if (limit === void 0) { limit = 10; }
    return __awaiter(this, void 0, void 0, function () {
        var options, stages, myAggregate, tickets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        page: page,
                        limit: limit,
                        sort: { name: sort ? -1 : 1, createdAt: -1 },
                    };
                    stages = [
                        {
                            $lookup: {
                                from: "departments",
                                let: { departmentId: "$departmentId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "department",
                            },
                        },
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "channel",
                            },
                        },
                        {
                            $lookup: {
                                from: "customers",
                                let: { customerId: "$customerId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$customerId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "customer",
                            },
                        },
                        {
                            $lookup: {
                                from: "categories",
                                let: { categoryId: "$categoryId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "category",
                            },
                        },
                        {
                            $lookup: {
                                from: "subcategories",
                                let: { subId: "$SubCategoryId" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$subId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "subCategory",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$userId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "user",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$createdBy" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "createdBy",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$closedBy" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "closedBy",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$coworkers" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1, firstName: 1, lastName: 1 } },
                                ],
                                as: "coworkers",
                            },
                        },
                        {
                            $lookup: {
                                from: "requests",
                                let: { requestId: "$requestId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$requestId"] } } },
                                    { $project: { userId: 1 } },
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: { userId: "$userId" },
                                            pipeline: [
                                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                                { $project: { firstName: 1, lastName: 1, departmentId: 1, email: 1 } },
                                                {
                                                    $lookup: {
                                                        from: "departments",
                                                        let: { departmentId: "$departmentId" },
                                                        pipeline: [
                                                            { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                                                            { $project: { name: 1 } },
                                                        ],
                                                        as: "department",
                                                    },
                                                },
                                                { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                                                { $unset: "departmentId" },
                                            ],
                                            as: "requester",
                                        },
                                    },
                                    { $unwind: { path: "$requester", preserveNullAndEmptyArrays: true } },
                                    { $unset: "userId" },
                                ],
                                as: "requestDetails",
                            },
                        },
                        { $unwind: { path: "$requestDetails", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$channel", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$closedBy", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                        { $unset: ["teamId", "channelId", "customerId", "categoryId", "userId", "SubCategoryId", "departmentId"] },
                        {
                            $match: {
                                $or: [
                                    { ticketNumber: { $regex: new RegExp(search), $options: "i" } },
                                    { "user.email": { $regex: new RegExp(search), $options: "i" } },
                                ],
                                state: state,
                                status: status,
                                isFiled: isFiled
                            },
                        },
                    ];
                    if (channelId !== "") {
                        stages.push({ $match: { "channel._id": ObjectId(channelId), } });
                    }
                    if (departmentId !== "") {
                        stages.push({ $match: { "department._id": ObjectId(departmentId), } });
                    }
                    myAggregate = ticket_model_1.default.aggregate(stages);
                    return [4 /*yield*/, ticket_model_1.default.aggregatePaginate(myAggregate, options, function (err, result) {
                            if (!err) {
                                return result;
                            }
                            else {
                                console.log(err);
                            }
                        })];
                case 1:
                    tickets = _a.sent();
                    return [2 /*return*/, tickets];
            }
        });
    });
}
exports.findFillingTicketsAggre = findFillingTicketsAggre;
function reports(openDate, closedDate, team, channel, status) {
    return __awaiter(this, void 0, void 0, function () {
        var stages, myAggregate;
        return __generator(this, function (_a) {
            stages = [
                {
                    $lookup: {
                        from: "departments",
                        let: { departmentId: "$departmentId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                            { $project: { name: 1 } },
                        ],
                        as: "department",
                    },
                },
                {
                    $lookup: {
                        from: "teams",
                        let: { teamId: "$teamId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                            { $project: { name: 1 } },
                        ],
                        as: "team",
                    },
                },
                {
                    $lookup: {
                        from: "channels",
                        let: { channelId: "$channelId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                            { $project: { name: 1 } },
                        ],
                        as: "channel",
                    },
                },
                {
                    $lookup: {
                        from: "customers",
                        let: { customerId: "$customerId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$customerId"] } } },
                            { $project: { name: 1 } },
                        ],
                        as: "customer",
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        let: { categoryId: "$categoryId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
                            { $project: { name: 1 } },
                        ],
                        as: "category",
                    },
                },
                {
                    $lookup: {
                        from: "subcategories",
                        let: { subId: "$SubCategoryId" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$subId"] } } },
                            { $project: { name: 1 } },
                        ],
                        as: "subCategory",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$userId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                            { $project: { email: 1, firstName: 1, lastName: 1 } },
                        ],
                        as: "user",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$createdBy" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                            { $project: { email: 1, firstName: 1, lastName: 1 } },
                        ],
                        as: "createdBy",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$closedBy" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                            { $project: { email: 1, firstName: 1, lastName: 1 } },
                        ],
                        as: "closedBy",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$coworkers" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$userId"] } } },
                            { $project: { email: 1, firstName: 1, lastName: 1 } },
                        ],
                        as: "coworkers",
                    },
                },
                {
                    $lookup: {
                        from: "requests",
                        let: { requestId: "$requestId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$requestId"] } } },
                            { $project: { userId: 1 } },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { userId: "$userId" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                        { $project: { firstName: 1, lastName: 1, departmentId: 1, email: 1 } },
                                        {
                                            $lookup: {
                                                from: "departments",
                                                let: { departmentId: "$departmentId" },
                                                pipeline: [
                                                    { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                                                    { $project: { name: 1 } },
                                                ],
                                                as: "department",
                                            },
                                        },
                                        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                                        { $unset: "departmentId" },
                                    ],
                                    as: "requester",
                                },
                            },
                            { $unwind: { path: "$requester", preserveNullAndEmptyArrays: true } },
                            { $unset: "userId" },
                        ],
                        as: "requestDetails",
                    },
                },
                { $unwind: { path: "$requestDetails", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$channel", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$closedBy", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                { $unset: ["teamId", "channelId", "customerId", "categoryId", "userId", "SubCategoryId", "departmentId"] },
                {
                    $match: {
                        status: status,
                        createdAt: {
                            $gte: new Date(openDate),
                            $lte: new Date(closedDate)
                        }
                    },
                },
            ];
            if (team) {
                stages.push({ $match: { "team._id": ObjectId(team) } });
            }
            if (channel) {
                stages.push({ $match: { "channel._id": ObjectId(channel) } });
            }
            myAggregate = ticket_model_1.default.aggregate(stages);
            return [2 /*return*/, myAggregate];
        });
    });
}
exports.reports = reports;
function findTicketAggregate(requestId) {
    return __awaiter(this, void 0, void 0, function () {
        var stages, ticket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stages = [
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "channel",
                            },
                        },
                        {
                            $lookup: {
                                from: "customers",
                                let: { customerId: "$customerId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$customerId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "customer",
                            },
                        },
                        {
                            $lookup: {
                                from: "categories",
                                let: { categoryId: "$categoryId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "category",
                            },
                        },
                        {
                            $lookup: {
                                from: "subcategories",
                                let: { subId: "$SubCategoryId" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$subId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "subCategory",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$userId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1 } },
                                ],
                                as: "user",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$createdBy" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1 } },
                                ],
                                as: "createdBy",
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$coworkers" },
                                pipeline: [
                                    { $match: { $expr: { $in: ["$_id", "$$userId"] } } },
                                    { $project: { email: 1 } },
                                ],
                                as: "coworkers",
                            },
                        },
                        {
                            $lookup: {
                                from: "requests",
                                let: { requestId: "$requestId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$requestId"] } } },
                                    { $project: { userId: 1 } },
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: { userId: "$userId" },
                                            pipeline: [
                                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                                { $project: { firstName: 1, lastName: 1, departmentId: 1, email: 1 } },
                                                {
                                                    $lookup: {
                                                        from: "departments",
                                                        let: { departmentId: "$departmentId" },
                                                        pipeline: [
                                                            { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                                                            { $project: { name: 1 } },
                                                        ],
                                                        as: "department",
                                                    },
                                                },
                                                { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
                                                { $unset: "departmentId" },
                                            ],
                                            as: "requester",
                                        },
                                    },
                                    { $unwind: { path: "$requester", preserveNullAndEmptyArrays: true } },
                                    { $unset: "userId" },
                                ],
                                as: "requestDetails",
                            },
                        },
                        { $unwind: { path: "$requestDetails", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$channel", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
                        { $unset: ["teamId", "channelId", "customerId", "categoryId", "userId", "SubCategoryId"] },
                        {
                            $match: {
                                requestId: ObjectId(requestId)
                            }
                        }
                    ];
                    return [4 /*yield*/, ticket_model_1.default.aggregate(stages)];
                case 1:
                    ticket = _a.sent();
                    return [2 /*return*/, ticket];
            }
        });
    });
}
exports.findTicketAggregate = findTicketAggregate;
function findTicket(query) {
    return __awaiter(this, void 0, void 0, function () {
        var ticket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ticket_model_1.default.findOne(query)];
                case 1:
                    ticket = _a.sent();
                    return [2 /*return*/, ticket];
            }
        });
    });
}
exports.findTicket = findTicket;
function findTicketAndUpdate(query, update, options) {
    return __awaiter(this, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ticket_model_1.default.findByIdAndUpdate(query, update, options)];
                case 1:
                    updated = _a.sent();
                    return [2 /*return*/, updated];
            }
        });
    });
}
exports.findTicketAndUpdate = findTicketAndUpdate;
function getNextTicketId() {
    return __awaiter(this, void 0, void 0, function () {
        var ticket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ticket_model_1.default.findOne().sort({ createdAt: -1 })];
                case 1:
                    ticket = _a.sent();
                    return [2 /*return*/, ticket];
            }
        });
    });
}
exports.getNextTicketId = getNextTicketId;
function bulkUpdatea(query, update, options) {
    return __awaiter(this, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ticket_model_1.default.updateMany(query, update, options)];
                case 1:
                    updated = _a.sent();
                    return [2 /*return*/, updated];
            }
        });
    });
}
exports.bulkUpdatea = bulkUpdatea;
function createTransferTicket(input) {
    return __awaiter(this, void 0, void 0, function () {
        var newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transferredTicket_model_1.default.create(input)];
                case 1:
                    newData = _a.sent();
                    return [2 /*return*/, newData];
            }
        });
    });
}
exports.createTransferTicket = createTransferTicket;
function findTransferTicket(query) {
    return __awaiter(this, void 0, void 0, function () {
        var transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transferredTicket_model_1.default.findOne(query)];
                case 1:
                    transfer = _a.sent();
                    return [2 /*return*/, transfer];
            }
        });
    });
}
exports.findTransferTicket = findTransferTicket;
function findTransferTicketAggregate(_id) {
    return __awaiter(this, void 0, void 0, function () {
        var stages, transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stages = [
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$from.teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "from.team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$from.channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "from.channel",
                            },
                        },
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$to.teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "to.team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$to.channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "to.channel",
                            },
                        },
                        {
                            $match: {
                                _id: ObjectId(_id)
                            }
                        },
                        { $unwind: { path: "$from.team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$from.channel", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$to.team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$to.channel", preserveNullAndEmptyArrays: true } },
                        { $unset: ["from.teamId", "from.channelId", "to.teamId", "to.channelId"] }
                    ];
                    return [4 /*yield*/, transferredTicket_model_1.default.aggregate(stages)];
                case 1:
                    transfer = _a.sent();
                    return [2 /*return*/, transfer];
            }
        });
    });
}
exports.findTransferTicketAggregate = findTransferTicketAggregate;
function findTransferAndUpdate(query, update, options) {
    return __awaiter(this, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transferredTicket_model_1.default.findByIdAndUpdate(query, update, options)];
                case 1:
                    updated = _a.sent();
                    return [2 /*return*/, updated];
            }
        });
    });
}
exports.findTransferAndUpdate = findTransferAndUpdate;
function findAllTransferTicketAggregate(teamId, isApproved) {
    return __awaiter(this, void 0, void 0, function () {
        var isApprovedBool, stages, trasferTicket;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isApprovedBool = toBoolean_1.ToBoolean(isApproved);
                    stages = [
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$from.teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "from.team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$from.channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "from.channel",
                            },
                        },
                        {
                            $lookup: {
                                from: "teams",
                                let: { teamId: "$to.teamId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "to.team",
                            },
                        },
                        {
                            $lookup: {
                                from: "channels",
                                let: { channelId: "$to.channelId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$channelId"] } } },
                                    { $project: { name: 1 } },
                                ],
                                as: "to.channel",
                            },
                        },
                        {
                            $match: {
                                "to.teamId": ObjectId(teamId)
                            },
                        },
                        { $unwind: { path: "$from.team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$from.channel", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$to.team", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$to.channel", preserveNullAndEmptyArrays: true } },
                        { $unset: ["from.teamId", "from.channelId", "to.teamId", "to.channelId"] }
                    ];
                    if (isApproved) {
                        stages.push({ $match: { "isApproved": isApprovedBool } });
                    }
                    return [4 /*yield*/, transferredTicket_model_1.default.aggregate(stages)];
                case 1:
                    trasferTicket = _a.sent();
                    return [2 /*return*/, trasferTicket];
            }
        });
    });
}
exports.findAllTransferTicketAggregate = findAllTransferTicketAggregate;
