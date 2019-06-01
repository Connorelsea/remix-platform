// @flow
import gql from "graphql-tag";

import { type User } from "../../types/user";
import { mutate, query } from "../../utilities/gql_util";
import { GlobalState } from "../../reducers/rootReducer";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

import getUsersByIdSource from "./queries/getUsersById.graphql";
import getUsersByNameSource from "./queries/getUsersByName.graphql";
import relevantUsersSource from "./queries/relevantUsers.graphql";

// State
// Type definitions and initial state

export type State = {
  users: Array<User>,
  currentUserId: string | void,
};

const initialState: State = {
  users: [],
  currentUserId: undefined,
};

// Action Types
// Type definitions

type SetCurrentUserId = {
  type: "SET_CURRENT_USER_ID",
  payload: { id: string },
};

type AddOrUpdateUser = {
  type: "ADD_OR_UPDATE_USER",
  payload: { user: any },
};

type ReplaceUserById = {
  type: "REPLACE_USER_BY_ID",
  payload: { userId: string, newUser: User },
};

type ReplaceAllUsers = {
  type: "REPLACE_ALL_USERS",
  payload: { users: Array<User> },
};

type Action =
  | SetCurrentUserId
  | AddOrUpdateUser
  | ReplaceUserById
  | ReplaceAllUsers;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => State) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function setCurrentUserId(id: string): SetCurrentUserId {
  return {
    type: "SET_CURRENT_USER_ID",
    payload: { id },
  };
}

export function addOrUpdateUser(user: any): AddOrUpdateUser {
  return {
    type: "ADD_OR_UPDATE_USER",
    payload: { user },
  };
}

export function replaceUserById(
  userId: string,
  newUser: User
): ReplaceUserById {
  return {
    type: "REPLACE_USER_BY_ID",
    payload: { userId, newUser },
  };
}

export function replaceAllUsers(users: Array<User>): ReplaceAllUsers {
  return {
    type: "REPLACE_ALL_USERS",
    payload: { users },
  };
}

// Selectors

/**
 * getAllUsers
 *
 * Returns all users in the redux store
 */
export function getAllUsers(state: GlobalState): Array<User> {
  return state.identity.users;
}

/**
 * getUserById
 *
 * A selector cached on userId that returns a specific
 * user's meta information.
 */
export const getUserById = createCachedSelector(
  state => state.identity.users,
  (state, userId) => userId,
  (users: Array<User>, userId: string) => {
    console.log("USERZZZZZZZZ", users, userId);
    return users.find(user => user.id === userId);
  }
)((state: GlobalState, userId: string) => userId);

/**
 * fetchRelevantUsers
 *
 * Fetch a set of users' metadata from the remix server. This set of
 * users includes only users that are relevant to you so they are cached
 * client-side, like members of groups you are in or your friends.
 */
export function fetchRelevantUsers(): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const currentUserId = state.identity.currentUserId;

    // Fetch missing metadata from the server

    let response;
    console.log("FETCH RELEVANT USERS");

    try {
      response = await query(relevantUsersSource, {}, state.auth.apolloClient);
    } catch (e) {
      console.error(e);
    }
    const serverFoundUsers: Array<User> = response.data.relevantUsers;

    // Metadata for each user found on the server will be merged
    // with the existing user metadata in the redux store.

    console.log("SERVER FOUND USERS", serverFoundUsers);

    for (let user of serverFoundUsers) {
      dispatch(addOrUpdateUser(user));
    }

    return serverFoundUsers;
  };
}

// Subscriptions

export function subscribeToInvitations(userId: string): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const { apolloClient } = state.auth;

    console.log("Group Invitations - Init Subscriptions");

    const observable = apolloClient.subscribe({
      query: gql`
        subscription newUserUpdate($forUserId: ID!) {
          newUserUpdate(forUserId: $forUserId) {
            id
            name
            username
            email
            iconUrl
            color
            description
          }
        }
      `,
      variables: {
        forUserId: userId,
      },
    });

    return observable.subscribe({
      next(result) {
        console.log("Group Invitations - Sub Result", result);
        const user = result.data.newUserUpdate;
        dispatch(replaceUserById(user.id, user));
      },
      error(error) {
        console.error("Group Invitations - Sub Error", error);
      },
      complete() {
        console.log("Group Invitations - Sub Complete");
      },
    });
  };
}

/**
 * The following functions both retrieve metadata about a user based on
 * one of a user's multiple unique identifiers. They both use the local
 * redux store as a cache for user metadata, checking first if the a user
 * that represents the unique identifier already has metadata stored locally.
 *
 * All of these retrieval functions return an array of all requested users'
 * metadata which allows the ProvideUsers component to wait for this request
 * to finish and then provide its children with an array of all needed users.
 *
 * Updates to this metadata will probably be handled during runtime by
 * incoming subscription events. And/or invalidate this cache of metadata
 * on application start. Not sure about this yet, TODO
 */

/**
 * fetchUsersById
 *
 * Fetch a set of users' metadata based on unique IDs
 *
 * @param {Array<string>} userIdentifiers unique ids representing users
 */
export function fetchUsersById(userIds: Array<string>): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const allUsers: Array<User> = state.identity.users;
    const foundUsers: Array<User> = [];
    const missingUserIds: Array<string> = [];

    // For each identifier, check if the user metadata is available
    // locally, if not, add that identifier to the array of missing
    // identifiers.

    for (let id of userIds) {
      const foundUser: User | void = allUsers.find(u => u.id === id);
      if (foundUser) foundUsers.push(foundUser);
      else missingUserIds.push(id);
    }

    console.log("FETCH USERS BY ID");
    console.log("FOUND USERS", foundUsers);
    console.log("MISSING USER IDS", missingUserIds);

    // Fetch missing metadata from the server

    const getUsersVariables = {
      userIdentifiers: missingUserIds,
    };

    let serverFoundUsers: Array<User> = [];

    if (missingUserIds.length > 0) {
      const response = await query(getUsersByIdSource, getUsersVariables);
      serverFoundUsers = response.data.getUsersById;

      // Metadata for each user found on the server will be merged
      // with the existing user metadata in the redux store.

      for (let user of serverFoundUsers) {
        dispatch(addOrUpdateUser(user));
      }
    }

    // Return all required users from both sources as one array

    return [...foundUsers, ...serverFoundUsers];
  };
}

/**
 * fetchUsersByName
 *
 * Fetch a set of users' metadata based on unique usernames
 *
 * @param {Array<string>} userIdentifiers unique ids representing users
 */
export function fetchUsersByName(userNames: Array<string>): ThunkAction {
  return async (dispatch, getState) => {
    const state: GlobalState = getState();
    const allUsers: Array<User> = state.identity.users;
    const foundUsers: Array<User> = [];
    const missingUserNames: Array<string> = [];

    // For each identifier, check if the user metadata is available
    // locally, if not, add that identifier to the array of missing
    // identifiers.

    for (let name of userNames) {
      const foundUser: User | void = allUsers.find(u => u.username === name);
      if (foundUser) foundUsers.push(foundUser);
      else missingUserNames.push(name);
    }

    console.log("FETCH USERS BY NAME");
    console.log("FOUND USERS", foundUsers);
    console.log("MISSING USER NAMES", missingUserNames);

    // Fetch missing metadata from the server

    const getUsersVariables = {
      userIdentifiers: missingUserNames,
    };
    let serverFoundUsers: Array<User> = [];

    if (missingUserNames.length > 0) {
      const response = await query(getUsersByNameSource, getUsersVariables);
      serverFoundUsers = response.data.getUsersByName;

      // Metadata for each user found on the server will be merged
      // with the existing user metadata in the redux store.

      for (let user of serverFoundUsers) {
        dispatch(addOrUpdateUser(user));
      }
    }

    // Return all required users from both sources as one array

    return [...foundUsers, ...serverFoundUsers];
  };
}

export function updateUser(
  newName: string,
  newUsername: string,
  newDescription: string
): ThunkAction {
  return async (dispatch, getState) => {
    const state: GlobalState = getState();
    const allUsers: Array<User> = state.identity.users;
    const apolloClient = state.auth.apolloClient;

    console.log("UPDATE USER", newName, newUsername, newDescription);

    const updateSrc = gql`
      mutation updateUser(
        $newName: String
        $newUsername: String
        $newDescription: String
      ) {
        updateUser(
          newName: $newName
          newUsername: $newUsername
          newDescription: $newDescription
        ) {
          id
          name
          username
          email
          iconUrl
          color
          description
        }
      }
    `;

    const updateVars = { newName, newUsername, newDescription };

    const response = await mutate(updateSrc, updateVars, apolloClient);
    console.log(response);
    const newUser = response.data.updateUser;
    console.log("NEW USERZZZ");
    console.log(newUser);

    const foundUserIndex = allUsers.findIndex(u => u.id === newUser.id);
    let newUsers = allUsers;
    newUsers.splice(foundUserIndex, 1, newUser);

    dispatch(replaceAllUsers(newUsers));
  };
}

// Reducer

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "SET_CURRENT_USER_ID": {
      return {
        ...state,
        currentUserId: action.payload.id,
      };
    }

    case "ADD_OR_UPDATE_USER": {
      const foundUserIndex = state.users.findIndex(
        u => u.id === action.payload.user.id
      );
      if (foundUserIndex >= 0) {
        let newUsers = state.users;
        newUsers.splice(foundUserIndex, 1, action.payload.user);
        return {
          ...state,
          users: newUsers,
        };
      }

      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    }

    case "REPLACE_USER_BY_ID": {
      const foundUserIndex = state.users.findIndex(
        u => u.id === action.payload.userId
      );
      let newUsers = state.users;
      newUsers.splice(foundUserIndex, 1, action.payload.newUser);
      return {
        ...state,
        users: newUsers,
      };
    }

    case "REPLACE_ALL_USERS": {
      console.log("REPLACE_ALL_USERS", action.payload.users);
      return {
        ...state,
        users: action.payload.users,
      };
    }

    default:
      return state;
  }
}

export default reducer;
