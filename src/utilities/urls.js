import { type User } from "../types/user";
import { type Group } from "../types/group";
import { type Chat } from "../types/chat";

export function buildUserUrl(user: User) {
  return `/u/@${user.username}`;
}

export function buildGroupUrl(group: Group) {
  return `/g/+${group.username}`;
}

export function buildChatLink(group: Group, chat: Chat) {
  if (group.isDirectMessage) return `/u/@${group.username}/${chat.name}`;
  return `/g/+${group.username}/${chat.name}`;
}

export function buildEditUserUrl(user: User) {
  return `/edit/u/@${user.username}`;
}
