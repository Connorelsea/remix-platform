// @flow

import { type GlobalState } from "../reducers/rootReducer";

// State
// Type definitions and initial state

export type State = {
  shouldShowStoragePage: boolean,
  shouldShowProfilePicNotif: boolean,
  shouldShowEditProfileNotif: boolean,
};

// Action Types
// Type definitions

type EndStoragePage = { type: "END_STORAGE_PAGE" };
type EndProfilePicNotif = { type: "END_PROFILE_PIC_NOTIF" };
type EndEditProfileNotif = { type: "END_EDIT_PROFILE_NOTIF" };

type Action = EndStoragePage | EndProfilePicNotif | EndEditProfileNotif;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => GlobalState) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function endStoragePage(): EndStoragePage {
  return { type: "END_STORAGE_PAGE" };
}

export function endProfilePicNotif(): EndProfilePicNotif {
  return { type: "END_PROFILE_PIC_NOTIF" };
}

export function endEditProfileNotif(): EndEditProfileNotif {
  return { type: "END_EDIT_PROFILE_NOTIF" };
}

// Reducer

export function reducer(
  state: State = {
    shouldShowStoragePage: true,
    shouldShowProfilePicNotif: true,
    shouldShowEditProfileNotif: true,
  },
  action: Action
): State {
  switch (action.type) {
    case "END_STORAGE_PAGE": {
      return { ...state, shouldShowStoragePage: false };
    }
    case "END_PROFILE_PIC_NOTIF": {
      return { ...state, shouldShowProfilePicNotif: false };
    }
    case "END_EDIT_PROFILE_NOTIF": {
      return { ...state, shouldShowEditProfileNotif: false };
    }
    default:
      return state;
  }
}
