import { themes, Theme } from "../utilities/theme";
import { fetchFriendsData } from "./friends";
import { fetchGroupsData } from "./groups/index.js";
import { fetchMessagesData } from "./messages";
import { type GlobalState } from "../reducers/rootReducer";

// Middleware action types
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => GlobalState) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// ACTION TYPE DEFINITIONS

// SELECTORS

export const themeSelector = state => state.app.themes[state.app.themeIndex];

// INITIAL STATE

export type State = {
  themes: Array<Theme>,
  theme: Theme,
};

const initialState: State = {
  themes,
  themeIndex: 1,
};

// ACTIONS

type InitDataAction = { type: "INIT_DATA_ACTION" };

type Action = InitDataAction | void;

// ACTION CREATORS

export function initData(userId) {
  return async function(dispatch, getState) {
    const dataDucks = await Promise.all([
      dispatch(fetchFriendsData(userId)),
      dispatch(fetchGroupsData(userId)),
      dispatch(fetchMessagesData(userId)),
    ]);
  };
}

// REDUCER

export function reducer(
  state: State = {
    themes,
    themeIndex: 1,
  },
  action: Action
): State {
  switch (action.type) {
    default:
      return state;
  }
}
