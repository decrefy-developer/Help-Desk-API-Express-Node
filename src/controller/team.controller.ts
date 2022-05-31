import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  createTeam,
  findAllTeam,
  findTeam,
  findTeamAggregate,
  findTeamAndUpdate,
} from "../service/team.service";
import { ToBoolean } from "../utils/toBoolean";

export async function createTeamHandler(req: Request, res: Response) {
  try {
    const teamName = get(req.body, "name");

    const team = await findTeam({ name: teamName });

    if (team)
      return res.status(409).send({
        message: "Team Name is already exist try another one!",
      });

    const inserted = await createTeam(req.body);

    return res.send(inserted);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readAllTeamHandler(req: Request, res: Response) {
  try {
    let page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;
    const status = get(req, "query.status");

    if (search !== "") page = 1; // change back the page into 1

    const isActive = ToBoolean(status);

    const teams = await findAllTeam(page, limit, sort, search, isActive);

    return res.send(teams);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readOneTeamHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const isExist = await findTeam({ _id: id });

    if (!isExist) res.status(404).send({ message: "No team Found!" });

    const team = await findTeamAggregate(id);

    return res.send(team);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function updateTeamHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const team = await findTeamAndUpdate({ _id: id }, req.body, { new: true });

    if (!team) return false;

    return res.send(team);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function changeTeamStatusHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const isExist = await findTeam({ _id: id });

    if (!isExist) return res.status(404).send({ message: "No team found!" });

    const team = await findTeamAndUpdate({ _id: id }, req.body, { new: true });

    return res.send(team);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}
