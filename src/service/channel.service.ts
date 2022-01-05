import {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Channel, { ChannelDocument } from "../model/channel.model";

export async function findChannel(query: FilterQuery<ChannelDocument>) {
  const channel = await Channel.findOne(query);
  return channel;
}

export async function createChannel(
  input: DocumentDefinition<ChannelDocument>
) {
  const newChannel = await Channel.create(input);
  return newChannel;
}

export async function findAllChannel(
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

  const myAggregate = Channel.aggregate([
    { $unwind: { path: "$members", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        let: { userId: "$members.userId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
          { $project: { email: 1 } },
        ],
        as: "members.user",
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "teamId",
        foreignField: "_id",
        as: "team",
      },
    },

    { $unwind: { path: "$members.user", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$_id", members: { $push: "$members" } } },
    {
      $lookup: {
        from: "channels",
        localField: "_id",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    { $unwind: { path: "$channelDetails" } },

    { $unset: ["members.userId"] },
    {
      $addFields: {
        "channelDetails.members": "$members",
      },
    },
    {
      $lookup: {
        from: "teams",
        let: { teamId: "$channelDetails.teamId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$teamId"] } } },
          { $project: { name: 1 } },
        ],
        as: "channelDetails.team",
      },
    },
    { $unset: ["channelDetails.teamId"] },
    {
      $unwind: {
        path: "$channelDetails.team",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $replaceRoot: { newRoot: "$channelDetails" } },
    {
      $match: {
        $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
      },
    },
  ]);

  const channels = await Channel.aggregatePaginate(
    myAggregate,
    options,
    function (err: any, result: AggregatePaginateResult<ChannelDocument>) {
      if (!err) {
        return result;
      } else {
        console.log(err);
      }
    }
  );
  return channels;
}

export async function findChannelAndUpdate(
  query: FilterQuery<ChannelDocument>,
  update: UpdateQuery<ChannelDocument>,
  options: QueryOptions
) {
  const updated = await Channel.findByIdAndUpdate(query, update, options);

  return updated;
}
