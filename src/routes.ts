import { Express, Request, Response } from "express";
import {
  changeCategoryStatusHandler,
  createCategoryHandler,
  readAllCategoryHandler,
  readOneCategoryHandler,
  updateCategoryHandler,
} from "./controller/category.controller";
import {
  changeChannelStatusHandler,
  createChannelHandler,
  readAllChannelHandler,
  readChannelHandler,
  updateChannelHandler,
} from "./controller/channel.controller";
import {
  changeCustomerStatusHandler,
  createCustomerHandler,
  readAllCustomerHandler,
  readCustomerHandler,
  updateCustomerHandler,
} from "./controller/customer.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
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
  transferringTicketHandler,
  realAllTransferredHandler,
  doneTransferringTicketHandler,
  readOneTransferredHandler,
} from "./controller/ticket.controller";
import {
  changeUserStatusHandler,
  createUserHandler,
  readAllUserHandler,
  readUserHanlder,
  resetPasswordHandler,
  teamUserHandler,
  updateUserHandler,
} from "./controller/user.controller";
import { requireUser, validateRequest, upload } from "./middleware";
import {
  changeCategoryStatusSchema,
  createCategorySchema,
  readCategorySchema,
  readOneCategorySchema,
  updateCategorySchema,
} from "./schema/category.schema";
import {
  changeChannelStatusSchema,
  createChannelSchema,
  readChannelSchema,
  updateChannelSchema,
} from "./schema/channel.schema";
import {
  changeCustomerStatusSchema,
  createCustomerSchema,
  readCustomerSchema,
  updatedCustomerSchema,
} from "./schema/customer.schema";
import {
  channgeTeamStatusSchema,
  createTeamSchema,
  readTeamSchema,
  updateTeamSchema,
} from "./schema/team.schema";
import {
  cancellingTicketSchema,
  closingTicketSchema,
  createTicketSchema,
  doneTicketSchema,
  doneTransferTicketSchema,
  getAllTicketSchema,
  getAllTransferredTicketSchema,
  getTransferredTicketSchema,
  requestTransferTicketSchema,
} from "./schema/ticket.schema";

import {
  changeUserStatusSchema,
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

  // todo ACCOUNTS
  app.get(
    "/api/user",
    [requireUser, validateRequest(readAllUserSchema)],
    readAllUserHandler
  );
  app.post(
    "/api/user",
    [requireUser, validateRequest(createUserSchema)],
    createUserHandler
  );
  app.put(
    "/api/user/:id",
    [requireUser, validateRequest(updateUserAccess)],
    updateUserHandler
  );
  app.put("/api/user/password/:id", [
    requireUser,
    validateRequest(resetPasswordSchema),
    resetPasswordHandler,
  ]);
  app.get("/api/user/:id", requireUser, readUserHanlder);
  app.put(
    "/api/user/status/:id",
    [requireUser, validateRequest(changeUserStatusSchema)],
    changeUserStatusHandler
  );
  // get teams
  app.get(
    "/api/team/user/:id",
    [requireUser, validateRequest(teamUserSchema)],
    teamUserHandler
  );

  // todo AUTHENTICATION
  app.post(
    "/api/login",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );
  app.delete("/api/logout", requireUser, invalidateUserSessionHandler);
  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  // todo TEAMS
  app.post("/api/team", validateRequest(createTeamSchema), createTeamHandler);
  app.get(
    "/api/team",
    [requireUser, validateRequest(readTeamSchema)],
    readAllTeamHandler
  );
  app.get("/api/team/:id", requireUser, readOneTeamHandler);
  app.put(
    "/api/team/:id",
    [requireUser, validateRequest(updateTeamSchema)],
    updateTeamHandler
  );
  app.put(
    "/api/team/status/:id",
    [requireUser, validateRequest(channgeTeamStatusSchema)],
    changeTeamStatusHandler
  );

  // todo CHANNELS
  app.post(
    "/api/channel",
    [requireUser, validateRequest(createChannelSchema)],
    createChannelHandler
  );
  app.get(
    "/api/channel",
    [validateRequest(readChannelSchema)],
    readAllChannelHandler
  );
  app.get("/api/channel/:id", requireUser, readChannelHandler);
  app.put(
    "/api/channel/:id",
    [requireUser, validateRequest(updateChannelSchema)],
    updateChannelHandler
  );
  app.put(
    "/api/channel/status/:id",
    [requireUser, validateRequest(changeChannelStatusSchema)],
    changeChannelStatusHandler
  );

  // todo Customer
  app.post(
    "/api/customer",
    [requireUser, validateRequest(createCustomerSchema)],
    createCustomerHandler
  );
  app.get(
    "/api/customer",
    [requireUser, validateRequest(readCustomerSchema)],
    readAllCustomerHandler
  );
  app.get("/api/customer/:id", requireUser, readCustomerHandler);
  app.get("/api/customer", requireUser, validateRequest(readCustomerSchema));
  app.put(
    "/api/customer/:id",
    [requireUser, validateRequest(updatedCustomerSchema)],
    updateCustomerHandler
  );
  app.put(
    "/api/customer/status/:id",
    [requireUser, validateRequest(changeCustomerStatusSchema)],
    changeCustomerStatusHandler
  );

  // todo MAJOR CATEGORIES
  app.post("/api/category", [
    requireUser,
    validateRequest(createCategorySchema),
    createCategoryHandler,
  ]);
  app.get(
    "/api/category",
    [requireUser, validateRequest(readCategorySchema)],
    readAllCategoryHandler
  );

  app.get("/api/category/:id", [
    requireUser,
    validateRequest(readOneCategorySchema),
    readOneCategoryHandler,
  ]);

  app.put(
    "/api/category/:id",
    [requireUser, validateRequest(updateCategorySchema)],
    updateCategoryHandler
  );
  app.put(
    "/api/category/status/:id",
    [requireUser, validateRequest(changeCategoryStatusSchema)],
    changeCategoryStatusHandler
  );

  // todo TICKETS
  app.post(
    "/api/ticket",
    [requireUser, validateRequest(createTicketSchema)],
    createTicketHandler
  );

  app.get(
    "/api/ticket",
    [requireUser, validateRequest(getAllTicketSchema)],
    readAllTicketHandler
  );
  app.put("/api/ticket/done/:id", [
    requireUser,
    validateRequest(doneTicketSchema),
    updateTicketHandler,
  ]);
  app.put(
    "/api/ticket/closing/:id",
    [requireUser, validateRequest(closingTicketSchema)],
    updateTicketHandler
  );

  app.put(
    "/api/ticket/cancel/:id",
    [requireUser, validateRequest(cancellingTicketSchema)],
    updateTicketHandler
  );

  app.put("/api/ticket/transfer/:id", [
    requireUser,
    validateRequest(requestTransferTicketSchema),
    transferringTicketHandler,
  ]);

  app.get("/api/transfer", [
    requireUser,
    validateRequest(getAllTransferredTicketSchema),
    realAllTransferredHandler,
  ]);

  app.get("/api/transfer/:id", [
    requireUser,
    validateRequest(getTransferredTicketSchema),
    readOneTransferredHandler,
  ]);

  app.put("/api/transfer/:id", [
    requireUser,
    validateRequest(doneTransferTicketSchema),
    doneTransferringTicketHandler,
  ]);

  // app.get("/api/ticket", requireUser, readAllTicketHandler);
}
