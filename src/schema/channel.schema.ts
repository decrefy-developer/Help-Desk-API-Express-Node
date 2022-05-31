import { boolean, number, object, string, array } from "yup";
import { query } from "./general.schema";

const payload = {
  body: object({
    name: string().required("Channel name is required"),
    teamId: string().required("Team Id is required"),
    isActive: boolean(),
  }),
};

const params = {
  params: object({
    id: string().required("ID is required!"),
  }),
};

export const createChannelSchema = object({ ...payload });

export const changeChannelStatusSchema = object({
  ...params,
  body: object({
    isActive: boolean().required("Status is required!"),
  }),
});

export const readChannelSchema = object({
  ...query,
});

export const readMembersFromChannelSchema = object({
  ...params,
});

export const ManageMemberToChannelSchema = object({
  ...params,
  body: object({
    mode: string().oneOf(["ADD", "REMOVE"]).required(),
    data: object().shape({
      userId: string().required(),
      email: string().email().required("email is required!"),
      isAdmin: boolean().required(),
    }),
  }),
});
