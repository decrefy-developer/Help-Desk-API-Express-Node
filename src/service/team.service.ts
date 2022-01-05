import {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Team, { TeamDocument } from "../model/team.model";

export async function findTeam(query: FilterQuery<TeamDocument>) {
  return await Team.findOne(query);
}

export async function createTeam(input: DocumentDefinition<TeamDocument>) {
  const newTeam = await Team.create(input);
  return newTeam;
}

export async function findAllTeam(
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
  const myAggregate = Team.aggregate([
    {
      $match: {
        $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
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
