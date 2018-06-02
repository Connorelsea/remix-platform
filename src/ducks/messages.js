// @flow

import { type GlobalState } from "../reducers/rootReducer";
import { type Message } from "../types/message";
import { query } from "../utilities/gql_util";
import messagesDataQuery from "./messages-data.graphql";
import { createSelector } from "reselect";
import { getAllUsers, getUserById } from "./identity/index.js";
import { type User } from "../types/user";
import createCachedSelector from "re-reselect";
import { type Group } from "../types/group";
import { getGroups } from "./groups/index.js";

// State
// Type definitions and initial state

export type State = {
  messages: Array<Message>,
  readPositions: Array<any>,
};

const initialState: State = {
  messages: [],
  readPositions: [],
};

// Action Types
// Type definitions

type NameAction = {
  type: "NAME",
  payload: any,
};

type SetDataAction = {
  type: "SET_MESSAGES_DATA_ACTION",
  payload: { data: MessagesDataType },
};

type Action = NameAction | SetDataAction;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => GlobalState) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function fetchMessagesData(userId: string): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();

    const response = await query(
      messagesDataQuery,
      { userId },
      state.auth.apolloClient
    );

    const payload = response.data.User;
    dispatch(setData(payload));
  };
}

type MessagesDataType = {
  allMessages: Array<Message>,
  currentReadPositions: Array<any>,
};

export function setData(data: MessagesDataType): SetDataAction {
  return {
    type: "SET_MESSAGES_DATA_ACTION",
    payload: { data },
  };
}

// Selectors

const getMessages = (state: GlobalState) => state.messages.messages;

/**
 * getAllMessages
 *
 * Returns fully hydrated message objects with the message content,
 * a full user object, and the appropriate read positions
 *
 */
export const getAllMessages = createSelector(
  getAllUsers,
  getMessages,
  (users: Array<User>, messages: Array<Message>) => {
    return messages.map(message => {
      return {
        ...message,
        user: getUserById(users, message.userId),
        readPositions: [],
      };
    });
  }
);

/**
 * getGroupMessages
 *
 * Return hydrated messages for a specific group
 */
export const getGroupMessages = createCachedSelector(
  getGroups,
  getAllMessages,
  (
    groups: Array<Group>,
    allMessages: Array<Message>,
    groupId: string
  ): Array<Message> => {
    const group: ?Group = groups.find(g => g.id === groupId);
    if (!group) return [];

    return allMessages.filter(msg =>
      group.chats.find(chat => chat.id === msg.chatId)
    );
  }
)((state: GlobalState, groupId: string) => groupId);

/**
 * getChatMessages
 *
 * Return hydrated messages for a speific chat
 */
export const getChatMessages = createCachedSelector(
  getAllMessages,
  (messages: Array<Message>, chatId: string) => {
    return messages.filter(msg => msg.chatId === chatId);
  }
)((state: GlobalState, chatId: string) => chatId);

// Reducer

export function reducer(
  state: State = {
    messages: [],
    readPositions: [],
  },
  action: Action
): State {
  switch (action.type) {
    case "SET_MESSAGES_DATA_ACTION": {
      const { allMessages, currentReadPositions } = action.payload.data;
      return {
        ...state,
        messages: allMessages,
        readPositions: currentReadPositions,
      };
    }
    default:
      return state;
  }
}
