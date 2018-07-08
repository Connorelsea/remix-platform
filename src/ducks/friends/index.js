import gql from "graphql-tag";
import { query } from "../../utilities/gql_util";

// Types
import { type GlobalState } from "../../reducers/rootReducer";
import { type FriendRequest } from "../../types/friendRequest";
import { type GroupInvitation } from "../../types/groupInvitation";

// Queries
import friendsDataQuery from "./queries/friends-data.graphql";
import friendRequestSub from "./queries/friendRequestSub.graphql";
import groupInvitationSub from "./queries/groupInvitationSub.graphql";

// State
// Type definitions and initial state

export type State = {
  friends: Array<string>,
  friendRequests: Array<FriendRequest>,
  groupInvitations: Array<GroupInvitation>,
};

// Action Types
// Type definitions

type GetDataAction = { type: "GET_DATA_ACTION" };

type SetDataAction = {
  type: "SET_FRIENDS_DATA_ACTION",
  payload: { data: State },
};

type AddFriendRequest = {
  type: "ADD_FRIEND_REQUEST",
  payload: {
    friendRequest: FriendRequest,
  },
};

type AddGroupInvitation = {
  type: "ADD_GROUP_INVITATION",
  payload: {
    groupInvitation: GroupInvitation,
  },
};

type Action = GetDataAction | SetDataAction | AddFriendRequest;

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

export function subscribeToRequests(userId: string): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const { apolloClient } = state.auth;

    console.log("Requests - Init Subscriptions");

    const observable = apolloClient.subscribe({
      query: gql`
        subscription newFriendRequest($toUserId: ID!) {
          newFriendRequest(toUserId: $toUserId) {
            id
            fromUser {
              id
              name
              username
              color
            }
            toUser {
              id
            }
            message
            createdAt
          }
        }
      `,
      variables: {
        toUserId: userId,
      },
    });

    console.log(observable);

    return observable.subscribe({
      next(result) {
        console.log("Requests - Sub Result", result);
        dispatch(addFriendRequest(result.data.newFriendRequest));
      },
      error(error) {
        console.error("Requests - Sub Error", error);
      },
      complete() {
        console.log("Requests - Sub Complete");
      },
    });
  };
}

export function subscribeToInvitations(userId: string): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const { apolloClient } = state.auth;

    console.log("Group Invitations - Init Subscriptions");

    const observable = apolloClient.subscribe({
      query: gql`
        subscription newGroupInvitation($toUserId: ID!) {
          newGroupInvitation(toUserId: $toUserId) {
            id
            fromUser {
              id
              name
              username
              color
            }
            toUser {
              id
            }
            forGroup {
              id
              name
            }
            message
            createdAt
          }
        }
      `,
      variables: {
        toUserId: userId,
      },
    });

    return observable.subscribe({
      next(result) {
        console.log("Group Invitations - Sub Result", result);
        dispatch(addGroupInvitation(result.data.newGroupInvitation));
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

export function setData(data: State): SetDataAction {
  return {
    type: "SET_FRIENDS_DATA_ACTION",
    payload: { data },
  };
}

export function addFriendRequest(
  friendRequest: FriendRequest
): AddFriendRequest {
  return {
    type: "ADD_FRIEND_REQUEST",
    payload: {
      friendRequest,
    },
  };
}

export function addGroupInvitation(
  groupInvitation: GroupInvitation
): AddGroupInvitation {
  return {
    type: "ADD_GROUP_INVITATION",
    payload: {
      groupInvitation,
    },
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
    case "ADD_FRIEND_REQUEST": {
      return {
        ...state,
        friendRequests: [...state.friendRequests, action.payload.friendRequest],
      };
    }
    case "ADD_GROUP_INVITATION": {
      return {
        ...state,
        groupInvitations: [
          ...state.groupInvitations,
          action.payload.groupInvitation,
        ],
      };
    }
    case "SET_FRIENDS_DATA_ACTION": {
      return {
        ...state,
        ...action.payload.data,
      };
    }
    default:
      return state;
  }
}
