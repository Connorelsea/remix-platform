import { type Tab, createTabObject } from "../types/tab";
import { push } from "react-router-redux";
import { type GlobalState } from "../reducers/rootReducer";

// @flow

// State
// Type definitions and initial state

export type State = {
  tabs: Array<Tab>,
  currentTabId: string | void,
  isShowingTabView: boolean,
};

const initialState: State = {
  tabs: [],
  currentTabId: undefined,
  isShowingTabView: false,
};

// Action Types

type AddTab = {
  type: "ADD_TAB",
  payload: {
    tab: Tab,
  },
};

type ShowTabView = {
  type: "SHOW_TAB_VIEW",
  payload: {
    value: boolean,
  },
};

type SetCurrentTabId = {
  type: "SET_CURRENT_TAB_ID",
  payload: {
    currentTabId: string,
  },
};

type ReplaceAllTabs = {
  type: "REPLACE_ALL_TABS",
  payload: {
    tabs: Array<Tab>,
  },
};

type Action = AddTab | ShowTabView | SetCurrentTabId | ReplaceAllTabs;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => State) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function addTab(tab: Tab): AddTab {
  return {
    type: "ADD_TAB",
    payload: {
      tab,
    },
  };
}

export function showTabView(value: boolean): ShowTabView {
  return {
    type: "SHOW_TAB_VIEW",
    payload: { value },
  };
}

export function createNewTab(
  url: string,
  title?: string,
  subtitle?: string,
  iconUrl?: string
): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();
    const currentTabs: Array<Tab> = state.tabs.tabs;
    const matchingTab: ?Tab = currentTabs.find(t => t.url === url);

    if (matchingTab !== undefined) {
      dispatch(setCurrentTab(matchingTab));
    } else {
      const newTab = createTabObject(url, title, subtitle, iconUrl);
      dispatch(addTab(newTab));
      dispatch(setCurrentTab(newTab));
    }
  };
}

export function setCurrentTab(tab: Tab): ThunkAction {
  return async function(dispatch, getState) {
    dispatch(push(tab.url));
    dispatch(setCurrentTabId(tab.id));
  };
}

export function setCurrentTabId(currentTabId: string): SetCurrentTabId {
  return {
    type: "SET_CURRENT_TAB_ID",
    payload: { currentTabId },
  };
}

/**
 * This replaces the previous tabs array with a new tabs array. It is
 * used by other components when the user drags, to update to a newly
 * sorted array of tabs.
 */
export function replaceAllTabs(tabs: Array<Tab>): ReplaceAllTabs {
  return {
    type: "REPLACE_ALL_TABS",
    payload: { tabs },
  };
}

// Selectors

// Reducer

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "ADD_TAB": {
      return {
        ...state,
        tabs: [...state.tabs, action.payload.tab],
        isShowingTabView: true,
      };
    }

    case "SET_CURRENT_TAB_ID": {
      return {
        ...state,
        currentTabId: action.payload.currentTabId,
        isShowingTabView: true,
      };
    }

    case "REPLACE_ALL_TABS": {
      return {
        ...state,
        tabs: action.payload.tabs,
      };
    }

    default: {
      return state;
    }
  }
}
