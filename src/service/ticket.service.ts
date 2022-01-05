import { result } from "lodash";
import {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Ticket, { TicketDocument } from "../model/ticket.model";
import TransferredTicket, {
  TransferredDocument,
} from "../model/transferredTicket.model";

export async function createTicket(input: DocumentDefinition<TicketDocument>) {
  const newTicket = await Ticket.create(input);
  return newTicket;
}

export async function findAllTickets(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string
) {
  const options = {
    page: page,
    limit: limit,
    sort: { name: sort ? -1 : 1, createdAt: -1 },
  };
  const myAggregate = Ticket.aggregate([
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
    { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$channel", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    { $unset: ["teamId", "channelId", "customerId", "categoryId", "userId"] },
    {
      $match: {
        $or: [
          { ticketNumber: { $regex: new RegExp(search), $options: "i" } },
          { state: { $regex: new RegExp(search), $options: "i" } },
          { status: { $regex: new RegExp(search), $options: "i" } },
          { "user.email": { $regex: new RegExp(search), $options: "i" } },
        ],
      },
    },
  ]);

  const tickets = await Ticket.aggregatePaginate(
    myAggregate,
    options,
    function (err: any, result: AggregatePaginateResult<TicketDocument>) {
      if (!err) {
        return result;
      } else {
        console.log(err);
      }
    }
  );

  return tickets;
}

export async function findTicket(query: FilterQuery<TicketDocument>) {
  const ticket = await Ticket.findOne(query);
  return ticket;
}

export async function findTicketAndUpdate(
  query: FilterQuery<TicketDocument>,
  update: UpdateQuery<TicketDocument>,
  options: QueryOptions
) {
  const updated = await Ticket.findByIdAndUpdate(query, update, options);

  return updated;
}

export async function getNextTicketId() {
  const ticket = await Ticket.findOne().sort({ createdAt: -1 });

  return ticket;
}

// todo: requesting to trasfer the ticket
export async function rquestTransferTicket(
  input: DocumentDefinition<TransferredDocument>
) {
  const transfer = await TransferredTicket.create(input);
  return transfer;
}

// todo: done  transfer the ticket
export async function findTransferredAndUpdate(
  query: FilterQuery<TransferredDocument>,
  update: UpdateQuery<TransferredDocument>,
  options: QueryOptions
) {
  const updated = await TransferredTicket.findOneAndUpdate(
    query,
    update,
    options
  );

  return updated;
}

export async function findAllTransferredTickets(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string
) {
  const options = {
    page: page,
    limit: limit,
    sort: { ticketNumber: sort ? -1 : 1, createdAt: -1 },
  };
  const myAggregate = TransferredTicket.aggregate([
    {
      $match: {
        $or: [{ ticketNumber: { $regex: new RegExp(search), $options: "i" } }],
      },
    },
  ]);

  const transfer = await TransferredTicket.aggregatePaginate(
    myAggregate,
    options,
    function (err: any, result: AggregatePaginateResult<TransferredDocument>) {
      if (!err) {
        return result;
      } else {
        console.log(err);
      }
    }
  );

  return transfer;
}

export async function findTransferredTicket(
  query: FilterQuery<TransferredDocument>
) {
  const transfer = await TransferredTicket.findOne(query);
  return transfer;
}
