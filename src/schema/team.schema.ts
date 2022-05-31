import { object, string, bool, number, boolean } from "yup";
import { query } from "./general.schema";

const payload = {
  body: object({
    name: string()
      .required("Team name is required")
      .min(5, "Team name is too short - should be 5 char minimum"),
  }),
};

const params = {
  params: object({
    id: string().required("ID is required!"),
  }),
};

export const createTeamSchema = object({ ...payload });

export const updateTeamSchema = object({ ...payload });

export const channgeTeamStatusSchema = object({
  body: object({
    isActive: bool().required("Status is required!"),
  }),
});

export const readTeamSchema = object({
  ...query,
});

export const readOneTeamSchema = object({
  ...params,
});
