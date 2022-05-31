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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTransferredTicketSchema = exports.updateTransferSchema = exports.getTransferSchema = exports.transferTicketSchema = exports.updateFillingSchema = exports.updateTargetDateSchema = exports.getAllNotSeenTicketSchema = exports.updateTicketSeenSchema = exports.getTransferredTicketSchema = exports.doneTransferTicketSchema = exports.cancellingTicketSchema = exports.closingTicketSchema = exports.doneTicketSchema = exports.getTicketSchema = exports.reportSchema = exports.getAllTicketSchema = exports.createTicketSchema = void 0;
var moment_1 = __importDefault(require("moment"));
var yup_1 = require("yup");
var dateNow = moment_1.default().toISOString();
var params = {
    params: yup_1.object({
        id: yup_1.string().required("ID is required"),
    }),
};
var body = {
    body: yup_1.object({
        mode: yup_1.string()
            .oneOf(["DONE TICKET", "CLOSING TICKET", "CANCELLING TICKET"])
            .required("The mode is required"),
    }),
};
var query = {
    query: yup_1.object({
        page: yup_1.number().required().integer().positive(),
        limit: yup_1.number().required(),
        sort: yup_1.boolean(),
        search: yup_1.string(),
        channelId: yup_1.string(),
        departmentId: yup_1.string(),
        state: yup_1.string()
            .oneOf(["PENDING", "DONE"])
            .required("The state is required"),
        status: yup_1.string()
            .oneOf(["OPEN", "CLOSED", "CANCELLED"])
            .required("The status is required"),
        isFiled: yup_1.boolean(),
        openDate: yup_1.date(),
        closedDate: yup_1.date(),
    }),
};
exports.createTicketSchema = yup_1.object({
    body: yup_1.object({
        requestId: yup_1.string(),
        departmentId: yup_1.string().required("The department is required"),
        requesterName: yup_1.string().required("Request name is required"),
        teamId: yup_1.string().required("The team is required"),
        channelId: yup_1.string().required("The channel is required"),
        categoryId: yup_1.string().required("The category of concern is required"),
        SubCategoryId: yup_1.array().of(yup_1.string()),
        userId: yup_1.string().required("The user is required"),
        description: yup_1.string().required("The description is required"),
        state: yup_1.string().oneOf(["PENDING"]).required("The state is required"),
        status: yup_1.string().oneOf(["OPEN"]).required("The status is required"),
        Coworkers: yup_1.array().of(yup_1.string()),
        startDate: yup_1.date()
            .required("The start date is required")
            .min(dateNow, "Please check the start date; it should not be lower today. "),
        targetDate: yup_1.date()
            .required("The target date is required")
            .min(dateNow, "Please check the target date; it should not be lower today. "),
        createdBy: yup_1.string().required("Created by is required"),
    }),
});
exports.getAllTicketSchema = yup_1.object(__assign({}, query));
exports.reportSchema = yup_1.object({
    query: yup_1.object({
        openDate: yup_1.date().required("Open Date is required"),
        closedDate: yup_1.date().required("closed Date is required"),
        team: yup_1.string(),
        channel: yup_1.string(),
        status: yup_1.string()
    })
});
exports.getTicketSchema = yup_1.object(__assign({}, params));
exports.doneTicketSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        mode: yup_1.string()
            .oneOf(["DONE TICKET", "CLOSING TICKET", "CANCELLING TICKET"])
            .required("The mode is required"),
        solution: yup_1.string().required("solution is required!"),
        categoryId: yup_1.string().required("Category is required"),
        SubCategoryId: yup_1.array().of(yup_1.string())
    }) }));
exports.closingTicketSchema = yup_1.object(__assign(__assign({}, params), body));
exports.cancellingTicketSchema = yup_1.object(__assign(__assign({}, params), body));
exports.doneTransferTicketSchema = yup_1.object(__assign(__assign({}, params), body));
exports.getTransferredTicketSchema = yup_1.object(__assign({}, params));
exports.updateTicketSeenSchema = yup_1.object(__assign({}, params));
exports.getAllNotSeenTicketSchema = yup_1.object(__assign({}, params));
exports.updateTargetDateSchema = yup_1.object({
    body: yup_1.object({
        targetDate: yup_1.date()
            .required("The target date is required")
            .min(dateNow, "Please check the target date; it should not be lower today. "),
    })
});
exports.updateFillingSchema = yup_1.object({
    body: yup_1.object({
        ticketId: yup_1.array().of(yup_1.string()).required("ticket Id's is required")
    })
});
exports.transferTicketSchema = yup_1.object({
    body: yup_1.object({
        ticketId: yup_1.string().required(),
        ticketNumber: yup_1.string().required("Ticket Number is required"),
        description: yup_1.string().required(),
        from: yup_1.object({
            teamId: yup_1.string().required(),
            channelId: yup_1.string().required()
        }),
        to: yup_1.object({
            teamId: yup_1.string().required(),
        }),
        remarks: yup_1.string()
    })
});
exports.getTransferSchema = yup_1.object(__assign({}, params));
exports.updateTransferSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        mode: yup_1.string().oneOf(["APPROVE", "CANCEL"]).required(),
        channelId: yup_1.string(),
        userId: yup_1.string()
    }) }));
exports.getAllTransferredTicketSchema = yup_1.object({
    query: yup_1.object({
        team: yup_1.string().required(),
        isApproved: yup_1.string()
    })
});
