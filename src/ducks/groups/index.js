// @flow

import { type GlobalState } from "../../reducers/rootReducer";
import { type Group } from "../../types/group";
import { query } from "../../utilities/gql_util";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import { getAllUsers } from "../identity/index.js";
import hash from "object-hash";

import groupsDataQuery from "./queries/groups-data.graphql";
import getGroupsByIdSource from "./queries/getGroupsById.graphql";
import getGroupsByNameSource from "./queries/getGroupsByName.graphql";

// State
// Type definitions and initial state

export type State = {
  groups: Array<Group>,
};

const initialState: State = {
  groups: [],
};

// Action Types
// Type definitions

type NameAction = {
  type: "NAME",
  payload: any,
};

type SetDataAction = {
  type: "SET_GROUPS_DATA_ACTION",
  payload: { data: State },
};

type AddOrUpdateGroup = {
  type: "ADD_OR_UPDATE_GROUP",
  payload: { group: any },
};

type Action = NameAction | SetDataAction | AddOrUpdateGroup;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => GlobalState) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function fetchGroupsData(userId: string): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();

    const response = await query(
      groupsDataQuery,
      { userId },
      state.auth.apolloClient
    );

    console.log("RESPONZE", response);

    const payload = response.data.User;
    dispatch(setData(payload));
  };
}

export function setData(data: State): SetDataAction {
  return {
    type: "SET_GROUPS_DATA_ACTION",
    payload: { data },
  };
}

export function addOrUpdateGroup(group: any): AddOrUpdateGroup {
  return {
    type: "ADD_OR_UPDATE_GROUP",
    payload: { group },
  };
}

// Selectors

/**
 * getGroups
 *
 * Returns all groups in hydrated form. Cache based on a hash
 * of the group array. Username determination changes based
 * on whether the group is a direct message or not.
 */
export const getGroups = createCachedSelector(
  getAllUsers,
  (state: GlobalState) => state.groups.groups,
  (state: GlobalState) => state.identity.currentUserId,
  (allUsers, groups, currentUserId) => {
    return groups.map(group => {
      if (group.isDirectMessage) {
        console.log("DIRECT MESSAGE GROUP", group);
        console.log("groups", groups);
        console.log("SELECTING FROM ALL GROUPS", allUsers);
        const otherUserId = group.members.find(m => currentUserId !== m.id).id;
        const otherUser = allUsers.find(u => otherUserId === u.id);

        console.log("CURRENT USER VS OTHER ", currentUserId, otherUserId);
        console.log(otherUser);

        return {
          ...group,
          username: otherUser.username,
          name: otherUser.name,
          description: otherUser.description,
          iconUrl: otherUser.iconUrl,
        };
      }

      return group;
    });
  }
)((state: GlobalState, itemName) => hash(state.groups.groups));

export function fetchGroupsById(groupIds: Array<string>): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const allGroups: Array<Group> = getGroups(state);
    const foundGroups: Array<Group> = [];
    const missingGroupIds: Array<string> = [];

    // For each identifier, check if the group metadata is available
    // locally, if not, add that identifier to the array of missing
    // identifiers.

    for (let id of groupIds) {
      const foundGroup: Group | void = allGroups.find(g => g.id === id);
      if (foundGroup) foundGroups.push(foundGroup);
      else missingGroupIds.push(id);
    }

    // Fetch missing metadata from the server

    const getGroupsVariables = {
      userIdentifiers: missingGroupIds,
    };

    const response = await query(getGroupsByIdSource, getGroupsVariables);
    const serverFoundGroups: Array<Group> = response.data.getGroupsById;

    // Metadata for each user found on the server will be merged
    // with the existing user metadata in the redux store.

    for (let user of serverFoundGroups) {
      dispatch(addOrUpdateGroup(user));
    }

    // Return all required users from both sources as one array

    return [...foundGroups, ...serverFoundGroups];
  };
}

export function fetchGroupsByName(groupNames: Array<string>): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const allGroups: Array<Group> = getGroups(state);
    const foundGroups: Array<Group> = [];
    const missingGroupNames: Array<string> = [];

    // For each identifier, check if the group metadata is available
    // locally, if not, add that identifier to the array of missing
    // identifiers.

    for (let name of groupNames) {
      const foundGroup: ?Group = allGroups.find(g => g.username === name);
      if (foundGroup) foundGroups.push(foundGroup);
      else missingGroupNames.push(name);
    }

    // Fetch missing metadata from the server

    const getGroupsVariables = {
      groupIdentifiers: missingGroupNames,
    };

    const response = await query(getGroupsByNameSource, getGroupsVariables);
    const serverFoundGroups: Array<Group> = response.data.getGroupsByName;

    // Metadata for each group found on the server will be merged
    // with the existing group metadata in the redux store.

    for (let group of serverFoundGroups) {
      dispatch(addOrUpdateGroup(group));
    }

    // Return all required groups from both sources as one array

    return [...foundGroups, ...serverFoundGroups];
  };
}
// Reducer

export function reducer(
  state: State = {
    groups: [],
  },
  action: Action
): State {
  switch (action.type) {
    case "SET_GROUPS_DATA_ACTION": {
      return {
        ...action.payload.data,
      };
    }

    case "ADD_OR_UPDATE_GROUP": {
      let newGroups = [];
      const incomingGroup = action.payload.group;
      const foundGroup = state.groups.find(g => g.id === incomingGroup.id);

      if (foundGroup) {
        // The incoming group is in the cache and needs
        // to be invalidated and updated
        newGroups = [
          ...state.groups.filter(g => g.id !== incomingGroup.id),
          incomingGroup,
        ];
      } else {
        // The incoming group has a unique id to this client
        // and is added to the group cache
        newGroups = [...state.groups, incomingGroup];
      }

      return {
        ...state,
        groups: newGroups,
      };
    }

    default:
      return state;
  }
}
