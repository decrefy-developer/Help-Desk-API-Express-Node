"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregate = exports.aggregateChannel = void 0;
var aggregateChannel = function (page, limit, ModelName) {
    var skip = (Number(page) - 1) * limit;
    var result = ModelName.aggregate([
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
exports.aggregateChannel = aggregateChannel;
var aggregate = function (page, limit, ModelName) {
    var skip = (Number(page) - 1) * limit;
    var result = ModelName.aggregate([
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
exports.aggregate = aggregate;
