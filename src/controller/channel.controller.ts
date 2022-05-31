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
import { ToBoolean } from "../utils/toBoolean";
import mongoose from "mongoose";

export async function createChannelHandler(req: Request, res: Response) {
  try {
    const teamId = get(req.body, "teamId");
    const team = await findTeam({ _id: teamId });
    if (!team) return res.status(404).send({ message: "No Team is found!" });

    const channel = get(req.body, "name");
    const isChannelExist = await findChannel({ name: channel });
    if (isChannelExist)
      return res
        .status(409)
        .send({ message: "Channel name is already exist!" });

    const newChannel = await createChannel(req.body);

    return res.send(newChannel);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readAllChannelHandler(req: Request, res: Response) {
  try {
    let page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;
    const status = get(req, "query.status");

    if (search !== "") page = 1; // turns back the page into 1

    const isActive = ToBoolean(status);

    const channels = await findAllChannel(page, limit, sort, search, isActive);

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

export async function ManageMemberToChannelHandler(
  req: Request,
  res: Response
) {
  try {
    const id = get(req, "params.id");
    const mode = get(req, "body.mode"); // is used to know if add/remove
    const data = get(req, "body.data");

    const isChannelExist = await findChannel({ _id: id });
    if (!isChannelExist)
      return res.status(404).send({ message: "No Channel found!" });

    // check the mode
    if (mode === "ADD") {
      const isMemberExist = isChannelExist.members.some(
        (item) => item.email === data.email
      );
      if (isMemberExist)
        return res
          .status(409)
          .send({ message: `${data.email} is already a member` });

      const channel = await findChannelAndUpdate(
        { _id: id },
        { $push: { members: data } },
        {
          new: true,
        }
      );

      return res.send(channel);
    } else {
      const channel = await findChannelAndUpdate(
        { _id: id },
        { $pull: { members: { userId: data.userId } } },
        {
          new: true,
        }
      );
      return res.send(channel);
    }
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
