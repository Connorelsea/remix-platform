// @flow

import { type Chat } from "./chat";
import { type User } from "./user";

export type Group = {
  id: string,
  iconUrl: string,
  username: string,
  name: string,
  description: string,
  isDirectMessage: boolean,
  chats: Array<Chat>,
  members: Array<User>,
};
