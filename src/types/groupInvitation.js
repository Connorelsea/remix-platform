// @flow

import { type User } from "./user";
import { type Group } from "./group";

export type GroupInvitation = {
  id: string,
  fromUser: User,
  toUser: User,
  forGroup: Group,
  message: string,
  createdAt: string,
};
