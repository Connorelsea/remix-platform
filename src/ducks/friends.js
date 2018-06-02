import { query } from "../utilities/gql_util";
import friendsDataQuery from "./friends-data.graphql";
import { CurrentDeviceSelector } from "./auth";
import { type GlobalState } from "../reducers/rootReducer";

// @flow

// State
// Type definitions and initial state

export type State = {
  friends: Array<string>,
  friendsRequests: Array<any>,
};

const initialState: State = {
  friends: [],
  friendRequests: [],
  groupInvitations: [],
  pendingFriendRequests: [],
  pendingGroupRequests: [],
};

// Action Types
// Type definitions

type GetDataAction = { type: "GET_DATA_ACTION" };

type SetDataAction = {
  type: "SET_FRIENDS_DATA_ACTION",
  payload: { data: State },
};

type Action = GetDataAction | SetDataAction;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: GlobalState, getState: () => State) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function fetchFriendsData(userId): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();

    const response = await query(
      friendsDataQuery,
      { userId },
      state.auth.apolloClient
    );

    const payload = response.data.User;
    console.log("friends payload", payload);
    dispatch(setData(payload));
  };
}

export function setData(data: State): SetDataAction {
  return {
    type: "SET_FRIENDS_DATA_ACTION",
    payload: { data },
  };
}

// Reducer

export function reducer(
  state: State = {
    friends: [],
    friendRequests: [],
    groupInvitations: [],
    pendingFriendRequests: [],
    pendingGroupRequests: [],
  },
  action: Action
): State {
  switch (action.type) {
    case "SET_FRIENDS_DATA_ACTION": {
      return {
        ...action.payload.data,
      };
    }
    default:
      return state;
  }
}
