import moment from "moment";
import { object, string, array, boolean, date, number } from "yup";

const dateNow = moment().toISOString();

const params = {
  params: object({
    id: string().required("ticket ID is required"),
  }),
};

const query = {
  query: object({
    page: number().required().integer().positive(),
    limit: number().required(),
    sort: boolean(),
    search: string(),
  }),
};

export const createTicketSchema = object({
  body: object({
    teamId: string().required("The team is required"),
    channelId: string().required("The channel is required"),
    customerId: string().required("The customer is required"),
    categoryId: string().required("The category of concern is required"),
    userId: string().required("The user is required"),
    description: string().required("The description is required"),
    state: string().oneOf(["PENDING"]).required("The state is required"),
    status: string().oneOf(["OPEN"]).required("The status is required"),
    Coworkers: array().of(string()),
    startDate: date()
      .required("The start date is required")
      .min(
        dateNow,
        "Please check the start date; it should not be lower today. "
      ),
    targetDate: date()
      .required("The target date is required")
      .min(
        dateNow,
        "Please check the target date; it should not be lower today. "
      ),
    createdBy: string().required("Created by is required"),
  }),
});

export const getAllTicketSchema = object({
  ...query,
});

export const doneTicketSchema = object({
  ...params,
  body: object({
    state: string()
      .oneOf(["DONE"], "The state to this function must be DONE")
      .required("The state is required"),
    doneDate: date()
      .required("The completion date is required!")
      .min(dateNow, "Please check the date; it should not be lower today. "),
  }),
});

export const closingTicketSchema = object({
  ...params,
  body: object({
    state: string().oneOf(["DONE"]).required("State is required"),
    status: string().oneOf(["CLOSED"]).required("Status is required"),
    closedDate: date()
      .required("The closed date is required!")
      .min(dateNow, "Please check the date; it should not be lower today. "),
  }),
});

export const requestTransferTicketSchema = object({
  ...params,
});

export const doneTransferTicketSchema = object({
  ...params,
  body: object({
    userId: string().required("user is required"),
    targetDate: date()
      .required("The target date is required!")
      .min(dateNow, "Please check the date; it should not be lower today. "),
  }),
});

export const getAllTransferredTicketSchema = object({
  ...query,
});

export const getTransferredTicketSchema = object({
  ...params,
});

export const cancellingTicketSchema = object({
  ...params,
  body: object({
    state: string().oneOf(["DONE"]).required("State is required"),
    status: string().oneOf(["CANCELLED"]).required("Status is required"),
    closedDate: date().required("Closed date is required!"),
  }),
});
