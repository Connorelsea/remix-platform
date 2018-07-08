// @flow

import { type User } from "./user";

export type FriendRequest = {
  id: string,
  fromUser: User,
  toUser: User,
  message: string,
  createdAt: string,
};
