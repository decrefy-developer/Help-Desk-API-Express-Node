import { boolean, number, object, string, array } from "yup";

const payload = {
  body: object({
    name: string().required("Channel name is required"),
    teamId: string().required("Team Id is required"),
    members: array(
      object({
        userId: string(),
        isAdmin: boolean(),
      })
    ),
    isActive: boolean(),
  }),
};

const params = {
  params: object({
    id: string().required("ID is required!"),
  }),
};

export const createChannelSchema = object({ ...payload });

export const updateChannelSchema = object({ ...params, ...payload });

export const changeChannelStatusSchema = object({
  ...params,
  body: object({
    isActive: boolean().required("Status is required!"),
  }),
});

export const readChannelSchema = object({
  query: object({
    page: number().required().integer().positive(),
    limit: number().required(),
    sort: boolean(),
    search: string(),
  }),
});
