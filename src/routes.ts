import { Express, Request, Response } from "express";
import {
  changeCategoryStatusHandler,
  createCategoryHandler,
  readAllCategoryHandler,
  readOneCategoryHandler,
  updateCategoryHandler,
} from "./controller/category.controller";
import {
  ManageMemberToChannelHandler,
  changeChannelStatusHandler,
  createChannelHandler,
  readAllChannelHandler,
  readChannelHandler,
} from "./controller/channel.controller";
import {
  changeCustomerStatusHandler,
  createCustomerHandler,
  readAllCustomerHandler,
  readCustomerHandler,
  updateCustomerHandler,
} from "./controller/customer.controller";
import { createDepartmentHandler, readAllDepartmentsHandler, readDepartmentHandler, updateDepartmetNameHandler } from "./controller/department.controller";
import { createRequestHandler, readRequestHandler, updateRequestHandler } from "./controller/request.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
import { createSubCategoryHandlerJ, readSubCategoryHandler, updateSubCategoryHandler } from "./controller/subCategory.controller";
import {
  changeTeamStatusHandler,
  createTeamHandler,
  readAllTeamHandler,
  readOneTeamHandler,
  updateTeamHandler,
} from "./controller/team.controller";
import {
  updateTicketHandler,
  createTicketHandler,
  readAllTicketHandler,
  readAllNotSeenTickethandler,
  updateTicketSeenHandler,
  readTicketSchemaHandler,
  fillingTicketHandler,
  updateTargetDateHandler,
  updateFillingHandler,
  reportsHandler,
  createTransferRequestHandler,
  getRequestTransferHandler,
  updateTransferTicketHandler,
  getAllTransferTicketHandler,
} from "./controller/ticket.controller";
import { createUnitHandler, readAllUnitHandler, readUnitHandler, updateUnitHandler } from "./controller/unit.controller";
import {
  changeUserStatusHandler,
  channelUserHandler,
  createUserHandler,
  readAllUserHandler,
  readUserHanlder,
  resetPasswordHandler,
  teamUserHandler,
  updateUserHandler,
} from "./controller/user.controller";
import { requireUser, validateRequest, upload } from "./middleware";
import validate from "./middleware/validateRequest";
import {
  changeCategoryStatusSchema,
  createCategorySchema,
  readCategorySchema,
  readOneCategorySchema,
  updateCategorySchema,
} from "./schema/category.schema";
import {
  ManageMemberToChannelSchema,
  changeChannelStatusSchema,
  createChannelSchema,
  readChannelSchema,
  readMembersFromChannelSchema,
} from "./schema/channel.schema";
import {
  changeCustomerStatusSchema,
  createCustomerSchema,
  readCustomerSchema,
  updatedCustomerSchema,
} from "./schema/customer.schema";
import { changeStatusSchema, createDepartmentSchema, readAllDepartmentsSchema, readDepartmentSchema, updateDepartmentNameSchema } from "./schema/department.schema";
import { createRequestSchema, readRequestSchema, updateRequestSchema } from "./schema/request.schema";
import { createSubCategorySchema, readSubCategorySchema, updateSubCategory, changeSubStatusSchema } from "./schema/subCategory.schema";
import {
  channgeTeamStatusSchema,
  createTeamSchema,
  readOneTeamSchema,
  readTeamSchema,
  updateTeamSchema,
} from "./schema/team.schema";
import {
  cancellingTicketSchema,
  closingTicketSchema,
  createTicketSchema,
  doneTicketSchema,
  doneTransferTicketSchema,
  getAllNotSeenTicketSchema,
  getAllTicketSchema,
  getAllTransferredTicketSchema,
  getTicketSchema,
  getTransferredTicketSchema,
  getTransferSchema,
  reportSchema,
  transferTicketSchema,
  updateFillingSchema,
  updateTargetDateSchema,
  updateTicketSeenSchema,
  updateTransferSchema,
} from "./schema/ticket.schema";
import { changeUnitStatusSchema, createUnitSchame, readAllUnitSchema, readUnitSchema, updateUnitNameSchema } from "./schema/unit.schema";

import {
  changeUserStatusSchema,
  channelUserSchama,
  createUserSchema,
  createUserSessionSchema,
  readAllUserSchema,
  resetPasswordSchema,
  teamUserSchema,
  updateUserAccess,
} from "./schema/user.schema";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/api/request", [requireUser, validateRequest(createRequestSchema)], createRequestHandler)
  app.get("/api/requests", [requireUser, validateRequest(readRequestSchema)], readRequestHandler)
  app.put("/api/request/status/:id", [requireUser, validateRequest(updateRequestSchema)], updateRequestHandler)

  // todo DEPARTMENT & UNITS
  app.post("/api/department", [requireUser, validateRequest(createDepartmentSchema)], createDepartmentHandler)
  app.get("/api/department/:id", [requireUser, validateRequest(readDepartmentSchema)], readDepartmentHandler)
  app.get("/api/departments", [requireUser, validateRequest(readAllDepartmentsSchema)], readAllDepartmentsHandler)
  app.put("/api/department/:id", [requireUser, validateRequest(updateDepartmentNameSchema)], updateDepartmetNameHandler)
  app.put("/api/department/status/:id", [requireUser, validateRequest(changeStatusSchema)], updateDepartmetNameHandler)

  app.post("/api/unit", [requireUser, validateRequest(createUnitSchame)], createUnitHandler)
  app.get("/api/unit/:id", [requireUser, validateRequest(readUnitSchema)], readUnitHandler)
  app.get("/api/units", [requireUser, validateRequest(readAllUnitSchema)], readAllUnitHandler)
  app.put("/api/unit/:id", [requireUser, validateRequest(updateUnitNameSchema)], updateUnitHandler)
  app.put("/api/unit/status/:id", [requireUser, validateRequest(changeUnitStatusSchema)], updateUnitHandler)

  // todo ACCOUNTS
  app.post("/api/user", [requireUser, validateRequest(createUserSchema)], createUserHandler);
  app.get("/api/user", [requireUser, validateRequest(readAllUserSchema)], readAllUserHandler);
  app.put("/api/user/:id", [requireUser, validateRequest(updateUserAccess)], updateUserHandler);
  app.put("/api/user/password/:id", [requireUser, validateRequest(resetPasswordSchema), resetPasswordHandler,]);
  app.get("/api/user/:id", requireUser, readUserHanlder);
  app.put("/api/user/status/:id", [requireUser, validateRequest(changeUserStatusSchema)], changeUserStatusHandler);
  app.get("/api/team/user/:id", [requireUser, validateRequest(teamUserSchema)], teamUserHandler); // get teams
  app.get("/api/channel/user", [requireUser, validateRequest(channelUserSchama)], channelUserHandler)

  // todo AUTHENTICATION
  app.post("/api/login", validateRequest(createUserSessionSchema), createUserSessionHandler);
  app.delete("/api/logout", requireUser, invalidateUserSessionHandler);
  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  // todo TEAMS
  app.post("/api/team", validateRequest(createTeamSchema), createTeamHandler);
  app.get("/api/team", [requireUser, validateRequest(readTeamSchema)], readAllTeamHandler);
  app.get("/api/team/:id", [requireUser, validateRequest(readOneTeamSchema)], readOneTeamHandler);
  app.put("/api/team/:id", [requireUser, validateRequest(updateTeamSchema)], updateTeamHandler);
  app.put("/api/team/status/:id", [requireUser, validateRequest(channgeTeamStatusSchema)], changeTeamStatusHandler);

  // todo CHANNELS
  app.post("/api/channel", [requireUser, validateRequest(createChannelSchema)], createChannelHandler);
  app.get("/api/channel", [validateRequest(readChannelSchema)], readAllChannelHandler);
  app.get("/api/channel/:id", requireUser, readChannelHandler);
  app.put("/api/channel/:id", [requireUser, validateRequest(ManageMemberToChannelSchema)], ManageMemberToChannelHandler);
  app.put("/api/channel/status/:id", [requireUser, validateRequest(changeChannelStatusSchema)], changeChannelStatusHandler);

  // todo Customer
  app.post("/api/customer", [requireUser, validateRequest(createCustomerSchema)], createCustomerHandler);
  app.get("/api/customer", [requireUser, validateRequest(readCustomerSchema)], readAllCustomerHandler);
  app.get("/api/customer/:id", requireUser, readCustomerHandler);
  app.put("/api/customer/:id", [requireUser, validateRequest(updatedCustomerSchema)], updateCustomerHandler);
  app.put("/api/customer/status/:id", [requireUser, validateRequest(changeCustomerStatusSchema)], changeCustomerStatusHandler);

  // todo MAJOR CATEGORIES & SUB
  app.post("/api/category", [requireUser, validateRequest(createCategorySchema), createCategoryHandler]);
  app.get("/api/category", [requireUser, validateRequest(readCategorySchema)], readAllCategoryHandler);
  app.get("/api/category/:id", [requireUser, validateRequest(readOneCategorySchema), readOneCategoryHandler,]);
  app.put("/api/category/:id", [requireUser, validateRequest(updateCategorySchema)], updateCategoryHandler);
  app.put("/api/category/status/:id", [requireUser, validateRequest(changeCategoryStatusSchema)], changeCategoryStatusHandler);

  app.post("/api/sub", [requireUser, validateRequest(createSubCategorySchema)], createSubCategoryHandlerJ)
  app.get("/api/sub", [requireUser, validateRequest(readSubCategorySchema)], readSubCategoryHandler)
  app.put("/api/sub/:id", [requireUser, validateRequest(updateSubCategory)], updateSubCategoryHandler)
  app.put("/api/sub/status/:id", [requireUser, validateRequest(changeSubStatusSchema)], updateSubCategoryHandler)
  // todo TICKETS
  app.post("/api/ticket", [requireUser, validateRequest(createTicketSchema)], createTicketHandler);
  app.get("/api/ticket", [requireUser, validateRequest(getAllTicketSchema)], readAllTicketHandler);
  app.get("/api/ticket/:id", [requireUser, validateRequest(getTicketSchema)], readTicketSchemaHandler);
  app.get('/api/ticket/seen/:id', [requireUser, validateRequest(getAllNotSeenTicketSchema)], readAllNotSeenTickethandler)
  app.put('/api/ticket/seen/:id', [requireUser, validateRequest(updateTicketSeenSchema)], updateTicketSeenHandler)
  app.put("/api/ticket/done/:id", [requireUser, validateRequest(doneTicketSchema), updateTicketHandler,]);
  app.put("/api/ticket/closing/:id", [requireUser, validateRequest(closingTicketSchema)], updateTicketHandler);
  app.put("/api/ticket/cancel/:id", [requireUser, validateRequest(cancellingTicketSchema)], updateTicketHandler);
  app.put("/api/ticket/target-date/:id", [requireUser, validateRequest(updateTargetDateSchema)], updateTargetDateHandler)

  app.get("/api/filling", [requireUser, validateRequest(getAllTicketSchema)], fillingTicketHandler);
  app.put("/api/filling", [requireUser, validateRequest(updateFillingSchema)], updateFillingHandler)

  app.get("/api/reports", [requireUser, validateRequest(reportSchema)], reportsHandler)

  app.post("/api/ticket/transfer", [requireUser, validateRequest(transferTicketSchema)], createTransferRequestHandler)
  app.get("/api/transfer", [requireUser, validateRequest(getAllTransferredTicketSchema)], getAllTransferTicketHandler)
  app.get("/api/transfer/:id", [requireUser, validateRequest(getTransferSchema)], getRequestTransferHandler)
  app.put("/api/transfer/:id", [requireUser, validateRequest(updateTransferSchema)], updateTransferTicketHandler)
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
