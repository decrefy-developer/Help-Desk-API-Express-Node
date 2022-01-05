import { Request, Response } from "express";
import { omit, get, update } from "lodash";
import {
  createUser,
  findAllUser,
  findAndUpdate,
  findChannelsOfTheUser,
  findUser,
} from "../service/user.service";
import log from "../logger";
import User from "../model/user.model";
import bcrypt from "bcrypt";
import config from "config";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const email = get(req.body, "email");

    const user = await findUser({ email });

    if (user)
      return res
        .status(409)
        .send({ message: "email is already exist! try again." });

    const inserted = await createUser(req.body);

    if (inserted) return res.send(omit(inserted.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "params.id");

    const user = await findUser({ _id: userId });

    if (!user) return res.send({ message: "No user found!" });

    const upadated = await findAndUpdate({ _id: userId }, req.body, {
      new: true,
    });

    if (!upadated) return false;

    return res.send(omit(upadated.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "params.id");

    const user = await findUser({ _id: userId });

    if (!user) return res.send({ message: "No user found!" });

    const resetPassword = "123456";
    const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
    const hashPassword = await bcrypt.hashSync(resetPassword, salt);

    const upadated = await findAndUpdate(
      { _id: userId },
      { password: hashPassword },
      {
        new: true,
      }
    );

    if (!upadated) return false;

    return res.send(omit(upadated.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readAllUserHandler(req: Request, res: Response) {
  try {
    let page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;
    const status = get(req, "query.status");

    if (search !== "") page = 1; // change back the page into 1

    const isActive = ToBoolean(status);

    const users = await findAllUser(page, limit, sort, search, isActive);

    return res.send(users);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readUserHanlder(req: Request, res: Response) {
  try {
    const userId = get(req, "params.id");

    const user = await findUser({ _id: userId });

    if (!user) return res.status(409).send({ message: "No user found!" });

    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function changeUserStatusHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "params.id");

    const user = await findUser({ _id: userId });

    if (!user) return res.send({ message: "No user found!" });

    const updated = await findAndUpdate({ _id: userId }, req.body, {
      new: true,
    });

    return res.send(updated);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function teamUserHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "params.id");

    const user = await findUser({ _id: userId });

    if (!user) return res.send({ message: "No user found!" });

    const result = await findChannelsOfTheUser(userId);

    return res.send(result);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

//funtion change to boolean
function ToBoolean(status: string) {
  let result: boolean;
  if (status === "true") {
    result = true;
  } else if (!status) {
    result = true;
    console.log(status);
  } else {
    result = false;
  }

  return result;
}
