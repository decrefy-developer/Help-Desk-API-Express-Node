import mongoose, {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Team, { TeamDocument } from "../model/team.model";

const ObjectId = mongoose.Types.ObjectId;

export async function findTeam(query: FilterQuery<TeamDocument>) {
  return await Team.findOne(query);
}

export async function findTeamAggregate(id: string) {

  const myAggregate = await Team.aggregate([
    {
      $addFields: { id: { $toObjectId: "$_id" } },
    },
    {
      $lookup: {
        from: "channels",
        let: { thisId: "$id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$teamId", "$$thisId"] } } },
          {
            $project: { name: 1, isActive: 1 },
          },
        ],
        as: "channels",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
        numberOfChannels: { $size: "$channels" },
        channels: "$channels",
      },
    },
    {
      $match: {
        "_id": ObjectId(id)
      }
    }
  ]);


  return myAggregate[0];
}

export async function createTeam(input: DocumentDefinition<TeamDocument>) {
  const newTeam = await Team.create(input);
  return newTeam;
}

export async function findAllTeam(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string,
  isActive: boolean = true
) {
  const options = {
    page: page,
    limit: limit,
    sort: { createdAt: -1 },
  };
  const myAggregate = Team.aggregate([
    {
      $addFields: { id: { $toObjectId: "$_id" } },
    },
    {
      $lookup: {
        from: "channels",
        let: { thisId: "$id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$teamId", "$$thisId"] } } },
          {
            $project: { name: 1, isActive: 1 },
          },
        ],
        as: "channels",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
        numberOfChannels: { $size: "$channels" },
        channels: "$channels",
      },
    },
    {
      $match: {
        $and: [
          { name: { $regex: new RegExp(search), $options: "i" } },
          { isActive: isActive },
        ],
      },
    },
  ]);

  const teams = await Team.aggregatePaginate(
    myAggregate,
    options,
    function (err: any, result: AggregatePaginateResult<TeamDocument>) {
      if (!err) {
        return result;
      } else {
        console.log(err);
      }
    }
  );

  return teams;
}

export async function findTeamAndUpdate(
  query: FilterQuery<TeamDocument>,
  update: UpdateQuery<TeamDocument>,
  options: QueryOptions
) {
  const updated = await Team.findByIdAndUpdate(query, update, options);

  return updated;
}
