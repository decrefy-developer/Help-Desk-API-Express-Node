import moment from "moment";
import { object, string, array, boolean, date, number } from "yup";

const dateNow = moment().toISOString();

const params = {
  params: object({
    id: string().required("ID is required"),
  }),
};


const body = {
  body: object({
    mode: string()
      .oneOf(["DONE TICKET", "CLOSING TICKET", "CANCELLING TICKET"])
      .required("The mode is required"),
  }),
}

const query = {
  query: object({
    page: number().required().integer().positive(),
    limit: number().required(),
    sort: boolean(),
    search: string(),
    channelId: string(),
    departmentId: string(),
    state: string()
      .oneOf(["PENDING", "DONE"])
      .required("The state is required"),
    status: string()
      .oneOf(["OPEN", "CLOSED", "CANCELLED"])
      .required("The status is required"),
    isFiled: boolean(),
    openDate: date(),
    closedDate: date(),
  }),
};

export const createTicketSchema = object({
  body: object({
    requestId: string(),
    departmentId: string().required("The department is required"),
    requesterName: string().required("Request name is required"),
    teamId: string().required("The team is required"),
    channelId: string().required("The channel is required"),
    categoryId: string().required("The category of concern is required"),
    SubCategoryId: array().of(string()),
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
  ...query
});

export const reportSchema = object({
  query: object({
    openDate: date().required("Open Date is required"),
    closedDate: date().required("closed Date is required"),
    team: string(),
    channel: string(),
    status: string()
  })
})

export const getTicketSchema = object({
  ...params
})

export const doneTicketSchema = object({
  ...params,
  body: object({
    mode: string()
      .oneOf(["DONE TICKET", "CLOSING TICKET", "CANCELLING TICKET"])
      .required("The mode is required"),
    solution: string().required("solution is required!"),
    categoryId: string().required("Category is required"),
    SubCategoryId: array().of(string())
  }),
});

export const closingTicketSchema = object({
  ...params,
  ...body
});

export const cancellingTicketSchema = object({
  ...params,
  ...body
});


export const doneTransferTicketSchema = object({
  ...params,
  ...body
});



export const getTransferredTicketSchema = object({
  ...params,
});


export const updateTicketSeenSchema = object({
  ...params
})


export const getAllNotSeenTicketSchema = object({
  ...params
})

export const updateTargetDateSchema = object({
  body: object({
    targetDate: date()
      .required("The target date is required")
      .min(
        dateNow,
        "Please check the target date; it should not be lower today. "
      ),
  })
})

export const updateFillingSchema = object({
  body: object({
    ticketId: array().of(string()).required("ticket Id's is required")
  })
})


export const transferTicketSchema = object({
  body: object({
    ticketId: string().required(),
    ticketNumber: string().required("Ticket Number is required"),
    description: string().required(),
    from: object({
      teamId: string().required(),
      channelId: string().required()
    }),
    to: object({
      teamId: string().required(),
    }),
    remarks: string()
  })
})

export const getTransferSchema = object({
  ...params
})

export const updateTransferSchema = object({
  ...params,
  body: object({
    mode: string().oneOf(["APPROVE", "CANCEL"]).required(),
    channelId: string(),
    userId: string()
  })
})


export const getAllTransferredTicketSchema = object({
  query: object({
    team: string().required(),
    isApproved: string()
  })
});