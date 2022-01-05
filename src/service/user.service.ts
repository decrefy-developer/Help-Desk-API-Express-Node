import { omit } from "lodash";
import {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import mongoose from "mongoose";
import Channel, { ChannelDocument } from "../model/channel.model";
import User, { UserDocument } from "../model/user.model";

const ObjectId = mongoose.Types.ObjectId;

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    return await User.create(input);
  } catch (err: any) {}
}

export async function findAllUser(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string,
  isActive: boolean = true
) {
  try {
    const options = {
      page: page,
      limit: limit,
      sort: { createdAt: -1 },
    };

    const myAggregate = User.aggregate([
      {
        $match: {
          $and: [
            { email: { $regex: new RegExp(search), $options: "i" } },
            { isActive: isActive },
          ],
        },
      },
      { $unset: ["password"] },
    ]);

    const users = await User.aggregatePaginate(
      myAggregate,
      options,
      function (err: any, result: AggregatePaginateResult<UserDocument>) {
        if (!err) {
          return result;
        } else {
          console.log(err);
        }
      }
    );

    return users;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return await User.findOne(query);
}

export function findAndUpdate(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) {
  return User.findByIdAndUpdate(query, update, options);
}

export async function findChannelsOfTheUser(userId: string) {
  const result = await Channel.aggregate([
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
    { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        "members.userId": ObjectId(userId),
      },
    },
    // {
    //   $project: { team: 1, name: 1 },
    // },
    {
      $group: {
        _id: "$team.name",
        channels: { $push: "$name" },
      },
    },
  ]);
  return result;
}

export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password"); //remove the password in array
}
