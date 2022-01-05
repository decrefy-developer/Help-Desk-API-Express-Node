type Teams = {
  _id: string;
  name: string;
  isActive: boolean;
};

type Channels = {
  _id: string;
  teamId: string; //reference to teams
  isActive: boolean;
  members: string[]; //array of userId
};

type Users = {
  _id: string;
  username: string;
  password: string;
  isActive: boolean;
  priviledge: string[];
};

enum State {
  PENDING,
  DONE,
  TRANSFER,
}

enum Status {
  OPEN,
  CLOSED,
}

type MajorCategories = {
  name: string;
  isActive: boolean;
};

type Tickets = {
  _id: string;
  channelId: string;
  userId: string; //reference to userId
  description: string;
  state: State;
  status: Status;
  coworkers: string[]; //reference to userId
  createdAt: Date;
  closedAt: Date;
  seen: boolean;
};
