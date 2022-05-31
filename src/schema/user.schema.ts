import { object, string, ref, array, boolean, number } from "yup";
import { query } from "./general.schema";

const priviledges = [
  "DEPARTMENT",
  "MEMBERS",
  "TEAMS",
  "CHANNELS",
  "CATEGORY",
  "DEPARTMENT",
  "CREATE TICKET",
  "REQUESTER",
  "SUPPORT"
];

const payload = {
  body: object({
    firstName: string().required("First name is required"),
    lastName: string().required("Last name is required"),
    departmentId: string().required("Department is required"),
    unitId: string(),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    priviledge: array().of(string().oneOf(priviledges)),
  }),
};

const params = {
  params: object({
    id: string().required(),
  }),
};

export const createUserSchema = object({
  ...payload,
});

export const updateUserAccess = object({
  ...params,
  body: object({
    priviledge: array().of(string().oneOf(priviledges)).required(),
  }),
});

export const resetPasswordSchema = object({
  ...params,
});

export const createUserSessionSchema = object({
  body: object({
    password: string().required("Password is required"),
    // .min(6, "Password is too short - should be 6 chars minimum.")
    // .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),

    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const changeUserStatusSchema = object({
  ...params,
  body: object({
    isActive: boolean().required("Status is required"),
  }),
});

export const readAllUserSchema = object({
  ...query,
});

export const teamUserSchema = object({
  ...params,
});

export const channelUserSchama = object({
  query: object({
    userId: string().required(),
    channelId: string().required()
  })
})