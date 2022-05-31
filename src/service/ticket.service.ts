import mongoose, {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { IMember } from "../model/channel.model";
import Ticket, { TicketDocument } from "../model/ticket.model";
import TransferredTicket, { TransferredDocument } from "../model/transferredTicket.model";
import { ToBoolean } from "../utils/toBoolean";

const ObjectId = mongoose.Types.ObjectId;

export async function createTicket(input: DocumentDefinition<TicketDocument>) {
  const newTicket = await Ticket.create(input);
  return newTicket;
}

export async function findAllTicketsAggre(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string,
  channelId: string,
  user: IMember,
  state: "DONE" | "PENDING",
  status: "OPEN" | "CLOSED" | "CANCELLED"
) {
  const options = {
    page: page,
    limit: limit,
    sort: { name: sort ? -1 : 1, createdAt: -1 },
  };

  let stages: any = [
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

  const myAggregate = Ticket.aggregate(stages);

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

export async function findFillingTicketsAggre(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string,
  channelId: string,
  departmentId: string,
  state: "DONE" | "PENDING",
  status: "OPEN" | "CLOSED" | "CANCELLED",
  isFiled: boolean,
) {
  const options = {
    page: page,
    limit: limit,
    sort: { name: sort ? -1 : 1, createdAt: -1 },
  };

  let stages: any = [
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
    stages.push({ $match: { "channel._id": ObjectId(channelId), } })
  }

  if (departmentId !== "") {
    stages.push({ $match: { "department._id": ObjectId(departmentId), } })
  }

  const myAggregate = Ticket.aggregate(stages);

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

export async function reports(
  openDate: Date,
  closedDate: Date,
  team: string,
  channel: string,
  status: "OPEN" | "CLOSED" | "CANCELLED",
) {

  let stages: any = [
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
    stages.push({ $match: { "team._id": ObjectId(team) } })
  }

  if (channel) {
    stages.push({ $match: { "channel._id": ObjectId(channel) } })
  }

  const myAggregate = Ticket.aggregate(stages);

  return myAggregate


}


export async function findTicketAggregate(requestId: string) {
  let stages: any = [
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
  ]


  const ticket = await Ticket.aggregate(stages);
  return ticket;
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

export async function bulkUpdatea(query: FilterQuery<TicketDocument>,
  update: UpdateQuery<TicketDocument>,
  options: QueryOptions) {
  const updated = await Ticket.updateMany(query, update, options);

  return updated;
}

export async function createTransferTicket(input: DocumentDefinition<TransferredDocument>) {
  const newData = await TransferredTicket.create(input)
  return newData
}

export async function findTransferTicket(query: FilterQuery<TransferredDocument>) {
  const transfer = await TransferredTicket.findOne(query)
  return transfer
}

export async function findTransferTicketAggregate(_id: string) {
  let stages: any = [
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
  ]

  const transfer = await TransferredTicket.aggregate(stages)
  return transfer
}

export async function findTransferAndUpdate(
  query: FilterQuery<TransferredDocument>,
  update: UpdateQuery<TransferredDocument>,
  options: QueryOptions
) {
  const updated = await TransferredTicket.findByIdAndUpdate(query, update, options);

  return updated;
}

export async function findAllTransferTicketAggregate(teamId: string, isApproved: string) {
  const isApprovedBool = ToBoolean(isApproved)
  let stages: any = [
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
  ]

  if (isApproved) {
    stages.push({ $match: { "isApproved": isApprovedBool } })
  }

  const trasferTicket = await TransferredTicket.aggregate(stages)

  return trasferTicket;
}