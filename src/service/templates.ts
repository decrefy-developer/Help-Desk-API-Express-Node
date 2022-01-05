import { Model } from "mongoose";

export const aggregateChannel = (
  page: number,
  limit: number,
  ModelName: Model<any>
) => {
  const skip = (Number(page) - 1) * limit;

  const result = ModelName.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        data: [
          {
            $lookup: {
              from: "teams",
              localField: "teamId",
              foreignField: "_id",
              as: "channel",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "members.userId",
              foreignField: "_id",
              as: "member",
            },
          },

          { $project: { members: 1 } },
        ],
      },
    },
    { $unwind: "$total" },
    {
      $project: {
        docs: {
          $slice: ["$data", skip, { $ifNull: [limit, "$total.count"] }],
        },
        page: {
          $literal: skip / limit + 1,
        },
        hasNextPage: {
          $lt: [{ $multiply: [limit, Number(page)] }, "$total.count"],
        },
        hasPrevPage: {
          $gt: [{ $multiply: [limit, Number(page)] }, "$total.count"],
        },
        totalPages: {
          $ceil: { $divide: ["$total.count", limit] },
        },
        totalItems: "$total.count",
      },
    },
  ]);

  return result;
};

export const aggregate = (
  page: number,
  limit: number,
  ModelName: Model<any>
) => {
  const skip = (Number(page) - 1) * limit;

  const result = ModelName.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        data: [{ $addFields: { _id: "$_id" } }, { $unset: ["password"] }],
      },
    },
    { $unwind: "$total" },
    {
      $project: {
        docs: {
          $slice: ["$data", skip, { $ifNull: [limit, "$total.count"] }],
        },
        page: {
          $literal: skip / limit + 1,
        },
        hasNextPage: {
          $lt: [{ $multiply: [limit, Number(page)] }, "$total.count"],
        },
        hasPrevPage: {
          $gt: [{ $multiply: [limit, Number(page)] }, "$total.count"],
        },
        totalPages: {
          $ceil: { $divide: ["$total.count", limit] },
        },
        totalItems: "$total.count",
      },
    },
  ]);

  return result;
};
