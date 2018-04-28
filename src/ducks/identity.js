// @flow

import { type User } from "../types/user";
import { mutate, query } from "../utilities/gql_util";
import { GlobalState } from "../reducers/rootReducer";

// State
// Type definitions and initial state

export type State = {
  users: Array<any>
};

const initialState: State = {
  users: []
};

// Action Types
// Type definitions

type SetCurrentUserId = {
  type: "SET_CURRENT_USER_ID",
  payload: { id: string }
};

type AddOrUpdateUser = {
  type: "ADD_OR_UPDATE_USER",
  payload: { user: any }
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
    payload: { id }
  };
}

export function addOrUpdateUser(user: any): AddOrUpdateUser {
  return {
    type: "ADD_OR_UPDATE_USER",
    payload: { user }
  };
}

/**
 * Return user meta data for each of the provided user ids, whether
 * this information is from the local redux store or from the server.
 * If it is not in the redux store it wil be retrieved from the server.
 *
 * @param {Array<id>} userIds Array of user ids
 */
export function getUsers(userIds: Array<string>): ThunkAction {
  return async (dispatch, getState) => {
    const state: GlobalState = getState();
    const allUsers: Array<User> = state.identity.users;
    const foundUsers: Array<User> = [];
    const missingUserIds: Array<string> = [];

    // For each provided user id,
    // If the user is found by id in the redux store, add to found users
    // If not, add to missingUserIds

    for (let id of userIds) {
      const foundUser: User | void = allUsers.find(u => u.id === id);
      if (foundUser) foundUsers.push(foundUser);
      else missingUserIds.push(id);
    }

    // A request will be made to the server to get the missing meta
    // info for all of the missing user ids

    const getUsersSource = `
      query getUsers(
        $users: [ID!]!
      ) {
        getUsers(
          users: $users
        ) {
          id
          name
          email
          username
          iconUrl
          color
        }
      }
    `;

    const getUsersVariables = {
      users: missingUserIds
    };

    const response = await query(getUsersSource, getUsersVariables);
    const serverFoundUsers: Array<User> = response.data.getUsers;

    // Newly acquired meta info for missing user ids will be added
    // to the redux client cache of all users

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
        currentUserId: action.payload.id
      };
    }

    case "ADD_OR_UPDATE_USER": {
      return {
        ...state,
        users: [...state.users, action.payload.user]
      };
    }

    default:
      return state;
  }
}

export default reducer;
