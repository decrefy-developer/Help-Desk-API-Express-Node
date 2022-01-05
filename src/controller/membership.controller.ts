import { Request, Response } from "express";
import log from "../logger";
import { omit, get } from "lodash";
import { registerMember } from "../service/member.service";
import { createUser, findUser } from "../service/user.service";

export async function registerMemberHandler(req: Request, res: Response) {
  try {
    const email = get(req.body, "email");

    const user = await findUser({ email });

    if (user)
      return res
        .status(409)
        .send({ message: "Email is already exist! try again." });

    const password = get(req.body, "password");
    const priviledge = [
      {
        module: "MEMBERSHIP",
        permission: ["READ"],
      },
      {
        module: "LOAN",
        permission: ["READ"],
      },
    ];

    const newUser = await createUser({ email });
  } catch (err: any) {
    log.error(err);
  }
}
