import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  createTicket,
  findAllTickets,
  findAllTransferredTickets,
  findTicket,
  findTicketAndUpdate,
  findTransferredAndUpdate,
  findTransferredTicket,
  rquestTransferTicket,
} from "../service/ticket.service";

export async function createTicketHandler(req: Request, res: Response) {
  try {
    const newTicket = await createTicket(req.body);

    return res.send(newTicket);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function updateTicketHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const ticket = await findTicket({ _id: id });

    if (!ticket) return res.send({ message: "No ticket found!" });

    const updated = await findTicketAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.send(updated);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function readAllTicketHandler(req: Request, res: Response) {
  try {
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;

    const tickets = await findAllTickets(page, limit, sort, search);

    return res.send(tickets);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function readOneTransferredHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const transferTicket = await findTransferredTicket({ _id: id });

    if (!transferTicket) return res.send({ message: "No data found" });

    return res.send(transferTicket);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function transferringTicketHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");
    const pushTagQuery = { $push: { tags: "TRANSFERRING" } }; // push the tranferring to tags field

    const ticket = await findTicket({ _id: id });

    if (!ticket) return res.send({ message: "No ticket found!" }); // check the ticket if exists

    const ticketId = id;
    const ticketNumber = get(ticket, "ticketNumber");
    const requestedBy = get(req, "user._id");
    const targetDate = get(ticket, "targetDate");
    const description = get(ticket, "description");

    // check is the ticket is already transferred
    const isExist = await findTransferredTicket({ ticketNumber });

    if (isExist)
      return res.send({
        message: "The ticket is already submitted as transfer",
      });

    //updated the tags of ticket
    const updated = await findTicketAndUpdate({ _id: id }, pushTagQuery, {
      new: true,
    });

    if (!updated)
      return res.send({
        message: "something went wrong during transferring of ticket",
      });

    const transferDetails = {
      ticketId,
      ticketNumber,
      description,
      requestedBy,
      targetDate,
    };

    const transferredTicket = await rquestTransferTicket(transferDetails);

    return res.send(transferredTicket);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function doneTransferringTicketHandler(
  req: Request,
  res: Response
) {
  try {
    const id = get(req, "params.id");

    const tansferredTicket = await findTransferredTicket({ _id: id });

    if (!tansferredTicket) return res.send({ message: "No data found!" });

    // update the ticket on transfer to "DONE TRUE"
    const updatedTransfer = await findTransferredAndUpdate(
      {
        ticketNumber: tansferredTicket.ticketNumber,
      },
      { isDone: true },
      { new: true }
    );

    if (!updatedTransfer)
      return res.send({
        message: "something went wrong during closing of transfer",
      });

    const updatedTicket = await findTicketAndUpdate(
      {
        _id: tansferredTicket.ticketId,
      },
      req.body,
      { new: true }
    );

    return res.send(updatedTicket);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function realAllTransferredHandler(req: Request, res: Response) {
  try {
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;

    const tickets = await findAllTransferredTickets(page, limit, sort, search);

    return res.send(tickets);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}
