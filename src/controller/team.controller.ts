import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  createTeam,
  findAllTeam,
  findTeam,
  findTeamAndUpdate,
} from "../service/team.service";

export async function createTeamHandler(req: Request, res: Response) {
  try {
    const teamName = get(req.body, "name");

    const team = await findTeam({ name: teamName });

    if (team)
      return res.send({
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
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;

    const teams = await findAllTeam(page, Number(limit), sort, search);

    return res.send(teams);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readOneTeamHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const team = await findTeam({ _id: id });

    if (!team) res.send({ message: "No team Found!" });

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
    console.log(id);
    const team = await findTeamAndUpdate({ _id: id }, req.body, { new: true });

    if (!team) return false;

    return res.send(team);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}
