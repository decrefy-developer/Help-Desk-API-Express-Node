import { Request, Response } from "express";
import config from "config";
import {
  createAccessToken,
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { get } from "lodash";

import { validatePassword } from "../service/user.service";
import { sign } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  // todo: validate the email and password
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send("Invalid username or password");

  // todo: Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // todo: create access token
  console.log("user-first", user);
  const accessToken = await createAccessToken({ user, session });

  // todo: create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1yr
  });

  // todo: send refresh & access token back
  return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
