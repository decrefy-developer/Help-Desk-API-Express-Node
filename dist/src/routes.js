"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var category_controller_1 = require("./controller/category.controller");
var channel_controller_1 = require("./controller/channel.controller");
var customer_controller_1 = require("./controller/customer.controller");
var department_controller_1 = require("./controller/department.controller");
var request_controller_1 = require("./controller/request.controller");
var session_controller_1 = require("./controller/session.controller");
var subCategory_controller_1 = require("./controller/subCategory.controller");
var team_controller_1 = require("./controller/team.controller");
var ticket_controller_1 = require("./controller/ticket.controller");
var unit_controller_1 = require("./controller/unit.controller");
var user_controller_1 = require("./controller/user.controller");
var middleware_1 = require("./middleware");
var category_schema_1 = require("./schema/category.schema");
var channel_schema_1 = require("./schema/channel.schema");
var customer_schema_1 = require("./schema/customer.schema");
var department_schema_1 = require("./schema/department.schema");
var request_schema_1 = require("./schema/request.schema");
var subCategory_schema_1 = require("./schema/subCategory.schema");
var team_schema_1 = require("./schema/team.schema");
var ticket_schema_1 = require("./schema/ticket.schema");
var unit_schema_1 = require("./schema/unit.schema");
var user_schema_1 = require("./schema/user.schema");
function default_1(app) {
    app.get("/healthcheck", function (req, res) {
        res.sendStatus(200);
    });
    app.post("/api/request", [middleware_1.requireUser, middleware_1.validateRequest(request_schema_1.createRequestSchema)], request_controller_1.createRequestHandler);
    app.get("/api/requests", [middleware_1.requireUser, middleware_1.validateRequest(request_schema_1.readRequestSchema)], request_controller_1.readRequestHandler);
    app.put("/api/request/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(request_schema_1.updateRequestSchema)], request_controller_1.updateRequestHandler);
    // todo DEPARTMENT & UNITS
    app.post("/api/department", [middleware_1.requireUser, middleware_1.validateRequest(department_schema_1.createDepartmentSchema)], department_controller_1.createDepartmentHandler);
    app.get("/api/department/:id", [middleware_1.requireUser, middleware_1.validateRequest(department_schema_1.readDepartmentSchema)], department_controller_1.readDepartmentHandler);
    app.get("/api/departments", [middleware_1.requireUser, middleware_1.validateRequest(department_schema_1.readAllDepartmentsSchema)], department_controller_1.readAllDepartmentsHandler);
    app.put("/api/department/:id", [middleware_1.requireUser, middleware_1.validateRequest(department_schema_1.updateDepartmentNameSchema)], department_controller_1.updateDepartmetNameHandler);
    app.put("/api/department/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(department_schema_1.changeStatusSchema)], department_controller_1.updateDepartmetNameHandler);
    app.post("/api/unit", [middleware_1.requireUser, middleware_1.validateRequest(unit_schema_1.createUnitSchame)], unit_controller_1.createUnitHandler);
    app.get("/api/unit/:id", [middleware_1.requireUser, middleware_1.validateRequest(unit_schema_1.readUnitSchema)], unit_controller_1.readUnitHandler);
    app.get("/api/units", [middleware_1.requireUser, middleware_1.validateRequest(unit_schema_1.readAllUnitSchema)], unit_controller_1.readAllUnitHandler);
    app.put("/api/unit/:id", [middleware_1.requireUser, middleware_1.validateRequest(unit_schema_1.updateUnitNameSchema)], unit_controller_1.updateUnitHandler);
    app.put("/api/unit/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(unit_schema_1.changeUnitStatusSchema)], unit_controller_1.updateUnitHandler);
    // todo ACCOUNTS
    app.post("/api/user", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.createUserSchema)], user_controller_1.createUserHandler);
    app.get("/api/user", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.readAllUserSchema)], user_controller_1.readAllUserHandler);
    app.put("/api/user/:id", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.updateUserAccess)], user_controller_1.updateUserHandler);
    app.put("/api/user/password/:id", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.resetPasswordSchema), user_controller_1.resetPasswordHandler,]);
    app.get("/api/user/:id", middleware_1.requireUser, user_controller_1.readUserHanlder);
    app.put("/api/user/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.changeUserStatusSchema)], user_controller_1.changeUserStatusHandler);
    app.get("/api/team/user/:id", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.teamUserSchema)], user_controller_1.teamUserHandler); // get teams
    app.get("/api/channel/user", [middleware_1.requireUser, middleware_1.validateRequest(user_schema_1.channelUserSchama)], user_controller_1.channelUserHandler);
    // todo AUTHENTICATION
    app.post("/api/login", middleware_1.validateRequest(user_schema_1.createUserSessionSchema), session_controller_1.createUserSessionHandler);
    app.delete("/api/logout", middleware_1.requireUser, session_controller_1.invalidateUserSessionHandler);
    app.get("/api/sessions", middleware_1.requireUser, session_controller_1.getUserSessionsHandler);
    // todo TEAMS
    app.post("/api/team", middleware_1.validateRequest(team_schema_1.createTeamSchema), team_controller_1.createTeamHandler);
    app.get("/api/team", [middleware_1.requireUser, middleware_1.validateRequest(team_schema_1.readTeamSchema)], team_controller_1.readAllTeamHandler);
    app.get("/api/team/:id", [middleware_1.requireUser, middleware_1.validateRequest(team_schema_1.readOneTeamSchema)], team_controller_1.readOneTeamHandler);
    app.put("/api/team/:id", [middleware_1.requireUser, middleware_1.validateRequest(team_schema_1.updateTeamSchema)], team_controller_1.updateTeamHandler);
    app.put("/api/team/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(team_schema_1.channgeTeamStatusSchema)], team_controller_1.changeTeamStatusHandler);
    // todo CHANNELS
    app.post("/api/channel", [middleware_1.requireUser, middleware_1.validateRequest(channel_schema_1.createChannelSchema)], channel_controller_1.createChannelHandler);
    app.get("/api/channel", [middleware_1.validateRequest(channel_schema_1.readChannelSchema)], channel_controller_1.readAllChannelHandler);
    app.get("/api/channel/:id", middleware_1.requireUser, channel_controller_1.readChannelHandler);
    app.put("/api/channel/:id", [middleware_1.requireUser, middleware_1.validateRequest(channel_schema_1.ManageMemberToChannelSchema)], channel_controller_1.ManageMemberToChannelHandler);
    app.put("/api/channel/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(channel_schema_1.changeChannelStatusSchema)], channel_controller_1.changeChannelStatusHandler);
    // todo Customer
    app.post("/api/customer", [middleware_1.requireUser, middleware_1.validateRequest(customer_schema_1.createCustomerSchema)], customer_controller_1.createCustomerHandler);
    app.get("/api/customer", [middleware_1.requireUser, middleware_1.validateRequest(customer_schema_1.readCustomerSchema)], customer_controller_1.readAllCustomerHandler);
    app.get("/api/customer/:id", middleware_1.requireUser, customer_controller_1.readCustomerHandler);
    app.put("/api/customer/:id", [middleware_1.requireUser, middleware_1.validateRequest(customer_schema_1.updatedCustomerSchema)], customer_controller_1.updateCustomerHandler);
    app.put("/api/customer/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(customer_schema_1.changeCustomerStatusSchema)], customer_controller_1.changeCustomerStatusHandler);
    // todo MAJOR CATEGORIES & SUB
    app.post("/api/category", [middleware_1.requireUser, middleware_1.validateRequest(category_schema_1.createCategorySchema), category_controller_1.createCategoryHandler]);
    app.get("/api/category", [middleware_1.requireUser, middleware_1.validateRequest(category_schema_1.readCategorySchema)], category_controller_1.readAllCategoryHandler);
    app.get("/api/category/:id", [middleware_1.requireUser, middleware_1.validateRequest(category_schema_1.readOneCategorySchema), category_controller_1.readOneCategoryHandler,]);
    app.put("/api/category/:id", [middleware_1.requireUser, middleware_1.validateRequest(category_schema_1.updateCategorySchema)], category_controller_1.updateCategoryHandler);
    app.put("/api/category/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(category_schema_1.changeCategoryStatusSchema)], category_controller_1.changeCategoryStatusHandler);
    app.post("/api/sub", [middleware_1.requireUser, middleware_1.validateRequest(subCategory_schema_1.createSubCategorySchema)], subCategory_controller_1.createSubCategoryHandlerJ);
    app.get("/api/sub", [middleware_1.requireUser, middleware_1.validateRequest(subCategory_schema_1.readSubCategorySchema)], subCategory_controller_1.readSubCategoryHandler);
    app.put("/api/sub/:id", [middleware_1.requireUser, middleware_1.validateRequest(subCategory_schema_1.updateSubCategory)], subCategory_controller_1.updateSubCategoryHandler);
    app.put("/api/sub/status/:id", [middleware_1.requireUser, middleware_1.validateRequest(subCategory_schema_1.changeSubStatusSchema)], subCategory_controller_1.updateSubCategoryHandler);
    // todo TICKETS
    app.post("/api/ticket", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.createTicketSchema)], ticket_controller_1.createTicketHandler);
    app.get("/api/ticket", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.getAllTicketSchema)], ticket_controller_1.readAllTicketHandler);
    app.get("/api/ticket/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.getTicketSchema)], ticket_controller_1.readTicketSchemaHandler);
    app.get('/api/ticket/seen/:id', [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.getAllNotSeenTicketSchema)], ticket_controller_1.readAllNotSeenTickethandler);
    app.put('/api/ticket/seen/:id', [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.updateTicketSeenSchema)], ticket_controller_1.updateTicketSeenHandler);
    app.put("/api/ticket/done/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.doneTicketSchema), ticket_controller_1.updateTicketHandler,]);
    app.put("/api/ticket/closing/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.closingTicketSchema)], ticket_controller_1.updateTicketHandler);
    app.put("/api/ticket/cancel/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.cancellingTicketSchema)], ticket_controller_1.updateTicketHandler);
    app.put("/api/ticket/target-date/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.updateTargetDateSchema)], ticket_controller_1.updateTargetDateHandler);
    app.get("/api/filling", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.getAllTicketSchema)], ticket_controller_1.fillingTicketHandler);
    app.put("/api/filling", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.updateFillingSchema)], ticket_controller_1.updateFillingHandler);
    app.get("/api/reports", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.reportSchema)], ticket_controller_1.reportsHandler);
    app.post("/api/ticket/transfer", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.transferTicketSchema)], ticket_controller_1.createTransferRequestHandler);
    app.get("/api/transfer", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.getAllTransferredTicketSchema)], ticket_controller_1.getAllTransferTicketHandler);
    app.get("/api/transfer/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.getTransferSchema)], ticket_controller_1.getRequestTransferHandler);
    app.put("/api/transfer/:id", [middleware_1.requireUser, middleware_1.validateRequest(ticket_schema_1.updateTransferSchema)], ticket_controller_1.updateTransferTicketHandler);
    // app.put("/api/ticket/transfer/:id", [
    //   requireUser,
    //   validateRequest(requestTransferTicketSchema),
    //   transferringTicketHandler,
    // ]);
    // app.put("/api/transfer/:id", [
    //   requireUser,
    //   validateRequest(doneTransferTicketSchema),
    //   doneTransferringTicketHandler,
    // ]);
    // app.get("/api/ticket", requireUser, readAllTicketHandler);
}
exports.default = default_1;
