import { themes, Theme } from "../utilities/theme";
import { fetchFriendsData, subscribeToRequests } from "./friends/index";
import { fetchGroupsData } from "./groups/index.js";
import { fetchMessagesData, subscribeToMessages } from "./messages";
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
  activeSubscriptions: Array<any>,
};

// ACTIONS

type InitDataAction = { type: "INIT_DATA_ACTION" };

type SetActiveSubscriptions = {
  type: "SET_ACTIVE_SUBSCRIPTIONS",
  payload: { subscriptions: Array<any> },
};

type Action = InitDataAction | SetActiveSubscriptions;

// ACTION CREATORS

export function initData(userId) {
  return async function(dispatch, getState) {
    const dataDucks = await Promise.all([
      dispatch(fetchFriendsData(userId)),
      dispatch(fetchGroupsData(userId)),
      dispatch(fetchMessagesData(userId)),
    ]);

    const subscriptions = await Promise.all([
      dispatch(subscribeToMessages(userId)),
      dispatch(subscribeToRequests(userId)),
    ]);

    dispatch(setActiveSubscriptions(subscriptions));
  };
}

/**
 * Erases previous set of active subscriptions and sets a new one. Each time
 * a new apollo client is made, any old subscriptions need to be killed.
 *
 * @param {Array<any>} subscriptions Array of subscription observables
 */
export function setActiveSubscriptions(subscriptions: Array<any>) {
  return {
    type: "SET_ACTIVE_SUBSCRIPTIONS",
    payload: {
      subscriptions,
    },
  };
}

export function invalidateActiveSubsriptions(): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();

    console.log(
      "App - Invalidating active subscriptions",
      state.app.activeSubscriptions
    );

    try {
      const subscriptions = state.app.activeSubscriptions;

      let promises = subscriptions.map(s => s.unsubscribe());

      promises = await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };
}
// REDUCER

export function reducer(
  state: State = {
    themes,
    themeIndex: 0,
    activeSubscriptions: [],
  },
  action: Action
): State {
  switch (action.type) {
    case "SET_ACTIVE_SUBSCRIPTIONS": {
      return {
        ...state,
        activeSubscriptions: action.payload.subscriptions,
      };
    }
    default:
      return state;
  }
}
