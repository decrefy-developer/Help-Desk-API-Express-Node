import { object, string, bool, number, boolean } from "yup";

const payload = {
  body: object({
    name: string()
      .required("Team name is required")
      .min(5, "Team name is too short - should be 5 char minimum"),
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
  query: object({
    page: number().required().integer().positive(),
    limit: number().required(),
    sort: boolean(),
    search: string(),
  }),
});
