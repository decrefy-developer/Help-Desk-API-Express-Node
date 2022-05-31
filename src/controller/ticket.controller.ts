import { Request, Response } from "express";
import { get } from "lodash";
import moment from "moment";
import log from "../logger";
import Ticket from "../model/ticket.model";
import { findChannel } from "../service/channel.service";
import {
  bulkUpdatea,
  createTicket,
  createTransferTicket,
  findAllTicketsAggre,
  findAllTransferTicketAggregate,
  findFillingTicketsAggre,
  findTicket,
  findTicketAggregate,
  findTicketAndUpdate,
  findTransferAndUpdate,
  findTransferTicket,
  findTransferTicketAggregate,
  reports,
} from "../service/ticket.service";
import { decode } from "../utils/jwt.utils";
import mongoose from 'mongoose'
import { ToBoolean } from "../utils/toBoolean";
import TransferredTicket from "../model/transferredTicket.model";

const dateNow = moment().toISOString();
const ObjectId = mongoose.Types.ObjectId;

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
    const request: any = req;
    let body: any;
    const id = get(req, "params.id");
    const mode = get(req, "body.mode")

    const ticket = await findTicket({ _id: id });

    if (!ticket) return res.send({ message: "No ticket found!" });

    if (mode === "DONE TICKET") {
      body = {
        state: "DONE",
        solution: req.body.solution,
        doneDate: dateNow,
        categoryId: req.body.categoryId,
        SubCategoryId: req.body.SubCategoryId
      }
    } else if (mode === "CLOSING TICKET") {
      body = {
        status: "CLOSED",
        closedDate: dateNow,
        closedBy: request.user._id
      }
    } else if (mode === "CANCELLING TICKET") {
      body = {
        status: "CANCELLED",
        closedDate: dateNow,
        state: "DONE",
        doneDate: dateNow,

      }
    }

    const updated = await findTicketAndUpdate({ _id: id }, body, {
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
    const channelId = get(req, "query.channelId") as string;
    const state = get(req, "query.state");
    const status = get(req, "query.status");

    const user = await getUserandRole(req, channelId);

    const tickets = await findAllTicketsAggre(
      page,
      limit,
      sort,
      search,
      channelId,
      user,
      state,
      status
    );

    return res.send(tickets);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function readTicketSchemaHandler(req: Request, res: Response) {
  try {
    const requestId = get(req, "params.id")

    const ticket = await findTicketAggregate(requestId)

    if (!ticket) {
      return res.send({ message: "no request ID found" })
    }

    return res.send(ticket[0])
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function readAllNotSeenTickethandler(req: Request, res: Response) {
  try {
    const userId = get(req, "params.id")
    const tickets = await Ticket.aggregate([{ $match: { $and: [{ seen: false }, { userId: ObjectId(userId) }] } }, { $group: { _id: "$channelId", count: { $sum: 1 } } }])

    return res.send(tickets)
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function updateTicketSeenHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");
    const ticket = await findTicket({ _id: id });

    if (!ticket) return res.send({ message: "No ticket found!" });

    const updated = await findTicketAndUpdate({ _id: id }, { seen: true }, {
      new: true,
    });

    return res.send(updated);

  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

async function getUserandRole(req: Request, channelId: string) {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const request: any = req;

  const channel = await findChannel({ _id: channelId });
  console.log('hello')

  const user = channel?.members.filter((member) => member.userId == request.user?._id);

  if (!user) {
    return {
      userId: "",
      email: "",
      isAdmin: true,
    };
  }

  if (user?.length == 0) {
    return {
      userId: "",
      email: "",
      isAdmin: true,
    };
  }

  return user[0];
}



export async function createTransferRequestHandler(req: Request, res: Response) {
  try {
    const ticketId = get(req, "body.ticketId");
    const ticketNumber = get(req, "body.ticketNumber")

    const ticket = await findTicket({ _id: ticketId })

    if (!ticket) return res.status(404).send({ message: "No ticket found!" })

    const isTicketNumberExist = await findTransferTicket({ ticketNumber, isApproved: false })

    if (isTicketNumberExist) return res.status(409).send({ message: "This ticket is already requested" })

    const description = get(req, "body.description")
    const from = get(req, "body.from")
    const to = get(req, "body.to")
    const remarks = get(req, "body.remarks")

    const inserted = await createTransferTicket({ ticketId, ticketNumber, description, from, to, remarks })

    return res.send(inserted)
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function getRequestTransferHandler(req: Request, res: Response) {
  try {
    const _id = get(req, "params.id");
    const result = await findTransferTicketAggregate(_id)

    return res.send(result)

  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}
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


export async function fillingTicketHandler(req: Request, res: Response) {
  try {
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;
    const channelId = get(req, "query.channelId") as string;
    const departmentId = get(req, "query.departmentId") as string;
    const state = get(req, "query.state");
    const status = get(req, "query.status");
    const isFiled = ToBoolean(get(req, "query.isFiled"))


    const tickets = await findFillingTicketsAggre(
      page,
      limit,
      sort,
      search,
      channelId,
      departmentId,
      state,
      status,
      isFiled
    );

    return res.send(tickets);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function updateTargetDateHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id")

    const isTicketExist = await findTicket({ _id: id })

    if (!isTicketExist) return res.send({ message: "no ticket found!" })

    const updated = await findTicketAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.send(updated)
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function updateFillingHandler(req: Request, res: Response) {
  try {
    const id = get(req, 'body.ticketId')

    const multipleUpdate = await bulkUpdatea({ _id: { $in: id } }, { $set: { isFiled: true, DateFiled: dateNow } }, { multi: true, new: true })

    return res.send(multipleUpdate)
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}


export async function reportsHandler(req: Request, res: Response) {
  try {
    const openDate = get(req, "query.openDate")
    const closedDate = get(req, "query.closedDate")
    const team = get(req, "query.team") as string;
    const channel = get(req, "query.channel") as string;
    const status = get(req, "query.status");

    const tickets = await reports(openDate, closedDate, team, channel, status)

    return res.send(tickets)

  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function updateTransferTicketHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id")
    const mode = get(req, "body.mode")
    const channelId = get(req, "body.channelId")
    const userId = get(req, "body.userId")

    if (mode === "APPROVE") {
      const updateTransfer = await findTransferAndUpdate({ _id: id }, {
        $set: {
          isApproved: true, dateApproved: dateNow, "to.channelId": channelId
        }
      }, { new: true })

      if (updateTransfer) {
        const { ticketId, to } = updateTransfer
        const updateTicket = await findTicketAndUpdate({ _id: ticketId }, { $set: { teamId: to.teamId, channelId: to.channelId, userId: userId, }, $push: { tags: "TRANSFERRED" } }, { new: true })

        return res.send(updateTransfer)
      }
    } else {
      const deleted = await TransferredTicket.findOneAndRemove({ _id: id })

      return res.send(deleted)

    }
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function getAllTransferTicketHandler(req: Request, res: Response) {
  try {

    const teamId = get(req, "query.team")
    const isApproved = get(req, "query.isApproved")

    const transfer = await findAllTransferTicketAggregate(teamId, isApproved)

    return res.send(transfer)
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}