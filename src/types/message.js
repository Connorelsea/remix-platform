// @flow

import { type Content } from "./content";

export type Message = {
  id: string,
  chatId: string,
  userId: string,
  content: Content,
  createdAt: string
};
