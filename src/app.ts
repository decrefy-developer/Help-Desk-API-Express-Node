import express from "express";
import config from "config";
import cors from "cors";

import log from "./logger";
import connect from "./db/connect";
import routes from "./routes";
import { deserializeUser } from "./middleware";

const PORT = config.get("port") as number;
const HOST = config.get("host") as string;

const app = express();
app.use(cors());
app.use(deserializeUser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, HOST, () => {
  log.info(`server listing at ${HOST}:${PORT}`);
  connect();

  routes(app);
});
