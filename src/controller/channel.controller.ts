import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import Channel from "../model/channel.model";
import {
  createChannel,
  findAllChannel,
  findChannel,
  findChannelAndUpdate,
} from "../service/channel.service";
import { findTeam } from "../service/team.service";

export async function createChannelHandler(req: Request, res: Response) {
  try {
    const teamId = get(req.body, "teamId");
    const team = await findTeam({ _id: teamId });
    if (!team) return res.send({ message: "No Team is found!" });

    const channel = get(req.body, "name");
    const isChannelExist = await findChannel({ name: channel });
    if (isChannelExist)
      return res.send({ message: "Channel name is already exist!" });

    const newChannel = await createChannel(req.body);

    return res.send(newChannel);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readAllChannelHandler(req: Request, res: Response) {
  try {
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;

    const channels = await findAllChannel(page, Number(limit), sort, search);

    return res.send(channels);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readChannelHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const channel = await findChannel({ _id: id });

    return res.send(channel);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function updateChannelHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");
    const isChannelExist = await findChannel({ _id: id });
    if (!isChannelExist) return res.send({ message: "No Channel found!" });

    const update = await findChannelAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.send(update);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function changeChannelStatusHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const update = await findChannelAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.send(update);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}
