// @flow

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

type Action = SetCurrentUserId | AddOrUpdateUser;

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
  getAllUsers,
  (users: Array<User>, userId: string) => {
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

    // Fetch missing metadata from the server

    const getUsersVariables = {
      userIdentifiers: missingUserIds,
    };

    const response = await query(getUsersByIdSource, getUsersVariables);
    const serverFoundUsers: Array<User> = response.data.getUsersById;

    // Metadata for each user found on the server will be merged
    // with the existing user metadata in the redux store.

    for (let user of serverFoundUsers) {
      dispatch(addOrUpdateUser(user));
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

    for (let id of userNames) {
      const foundUser: User | void = allUsers.find(u => u.id === id);
      if (foundUser) foundUsers.push(foundUser);
      else missingUserNames.push(id);
    }

    // Fetch missing metadata from the server

    const getUsersVariables = {
      userIdentifiers: missingUserNames,
    };

    const response = await query(getUsersByNameSource, getUsersVariables);
    const serverFoundUsers: Array<User> = response.data.getUsersByName;

    // Metadata for each user found on the server will be merged
    // with the existing user metadata in the redux store.

    for (let user of serverFoundUsers) {
      dispatch(addOrUpdateUser(user));
    }

    // Return all required users from both sources as one array

    return [...foundUsers, ...serverFoundUsers];
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
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    }

    default:
      return state;
  }
}

export default reducer;
