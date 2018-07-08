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
import gql from "graphql-tag";

// State
// Type definitions and initial state

export type State = {
  messages: Array<Message>,
  readPositions: Array<any>,
};

// Action Types
// Type definitions

type AddMessage = {
  type: "ADD_MESSAGE",
  payload: {
    message: Message,
  },
};

type SetDataAction = {
  type: "SET_MESSAGES_DATA_ACTION",
  payload: { data: MessagesDataType },
};

type Action = AddMessage | SetDataAction;

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

export function subscribeToMessages(userId: string): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const { apolloClient } = state.auth;

    console.log("Messages - Init Subscriptions");

    const observable = apolloClient.subscribe({
      query: gql`
      subscription newMessage {
        newMessage(forUserId: ${userId}) {
          id
          chatId
          userId
          content {
            type
            data
          }
        }
      }
    `,
    });

    console.log("SUBSCRIPTION OBSERVABLE", observable);

    return observable.subscribe({
      next(result) {
        console.log("SUB_RESULT", result);
        dispatch(addMessage(result.data.newMessage));
      },
      error(error) {
        console.log("SUB_ERROR", error);
      },
    });
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

export function addMessage(message: Message): AddMessage {
  return {
    type: "ADD_MESSAGE",
    payload: { message },
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
  state => state,
  getAllUsers,
  getMessages,
  (state: GlobalState, users: Array<User>, messages: Array<Message>) => {
    console.log("ALL MESSAGES ALL USERS", users);
    return messages.map(message => {
      return {
        ...message,
        user: getUserById(state, message.userId),
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
  (messages: Array<Message>, chatId: string) => chatId,
  (messages: Array<Message>, chatId: string) => {
    console.log("MESSGGZZZ", messages, chatId);
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
    case "ADD_MESSAGE": {
      const { message } = action.payload;
      return {
        ...state,
        messages: [...state.messages, message],
      };
    }
    default:
      return state;
  }
}
