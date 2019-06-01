import { push } from "react-router-redux";
import history from "../utilities/storage/history";
import { type Tab, createTabObject } from "../types/tab";
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

type UpdateTabByName = {
  type: "UPDATE_TAB_BY_NAME",
  payload: {
    tabName: string,
    url: string,
    title: string,
    subtitle: string,
    iconUrl: string,
  },
};

type UpdateTab = {
  type: "UPDATE_TAB",
  payload: {
    tabId: string,
    url: string,
    title: string,
    subtitle: string,
    iconUrl: string,
  },
};

type ReplaceAllTabs = {
  type: "REPLACE_ALL_TABS",
  payload: {
    tabs: Array<Tab>,
  },
};

type Action =
  | AddTab
  | ShowTabView
  | SetCurrentTabId
  | UpdateTab
  | UpdateTabByName
  | ReplaceAllTabs;

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

    console.log("CREATING NEW TAB", url, title, subtitle, iconUrl);

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

// UNUSED, probably remove soon

// export function updateTabByUrl(
//   tabUrl: string,
//   url: string,
//   title: string,
//   subtitle: string,
//   iconUrl: string
// ): ThunkAction {

//   return async function(dispatch, getState) {

//     const state: GlobalState = getState();
//     const foundTab: ?Tab = state.tabs.tabs.find(t => t.url === tabUrl);

//     if (foundTab) {
//       dispatch(push(url));
//       dispatch(updateTab(foundTab.id, url, title, subtitle, iconUrl));
//     }
//   };
// }

export function updateTab(
  tabId: string,
  url: string,
  title: string,
  subtitle: string,
  iconUrl: string
): ThunkAction {
  return async function(dispatch, getState) {
    const state: GlobalState = getState();

    const tabIndex = state.tabs.tabs.findIndex(t => t.id === tabId);
    const oldTab = state.tabs.tabs[tabIndex];

    history.replace(url ? url : oldTab.url);

    dispatch(setTab(tabId, url, title, subtitle, iconUrl));
  };
}

function setTab(
  tabId: string,
  url: string,
  title: string,
  subtitle: string,
  iconUrl: string
): UpdateTab {
  return {
    type: "UPDATE_TAB",
    payload: {
      tabId,
      url,
      title,
      subtitle,
      iconUrl,
    },
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

    case "UPDATE_TAB": {
      const { payload: { tabId, url, title, subtitle, iconUrl } } = action;

      const tabIndex = state.tabs.findIndex(t => t.id === tabId);

      const oldTab = state.tabs[tabIndex];
      const otherTabs = state.tabs.filter(t => t.id !== tabId);

      console.log("UPDAET TAB ACTION", action, tabIndex, oldTab);

      return {
        ...state,
        tabs: [
          ...otherTabs,
          {
            ...oldTab,
            url: url ? url : oldTab.url,
            title: title ? title : oldTab.title,
            subtitle: subtitle ? subtitle : oldTab.subtitle,
            iconUrl: iconUrl ? iconUrl : oldTab.iconUrl,
          },
        ],
        currentTabId: oldTab.id,
      };
    }

    case "REPLACE_ALL_TABS": {
      return {
        ...state,
        tabs: action.payload.tabs,
      };
    }

    case "@@router/LOCATION_CHANGE": {
      const newLocation = action.payload.location;

      const newPath = newLocation.pathname;
      const { tabs } = state;

      console.log("NEW PATH", newPath);

      // Check if tab with exact same URL already exists

      let matchingTab = tabs.find(t => t.url === newPath);
      if (matchingTab) return { ...state, currentTabId: matchingTab.id };

      // Check if tab is a chat of a user tab that already exists

      matchingTab = tabs.find(t => t.url.startsWith());

      console.log("CONDITIONAL", newPath.startsWith("/u"));

      if (newPath.startsWith("/u")) {
        const parts = newPath.split("/");
        const prefix = `/u/${parts[2]}`;

        console.log("PREFIX", prefix);

        let matchingTabIndex = tabs.findIndex(t => t.url.startsWith(prefix));

        if (matchingTabIndex !== -1) {
          const newTab = { ...matchingTab, url: newPath, title: newPath };
          let newTabs = tabs;
          tabs[matchingTabIndex] = newTab;
          return { ...state, tabs: newTabs, currentTabId: newTab.id };
        }
      }

      // Create new tab

      const newTab = createTabObject(newPath, newPath);
      const updatedTabs = [...state.tabs, newTab];

      return { ...state, tabs: updatedTabs, currentTabId: newTab.id };
    }

    // case "@@router/LOCATION_CHANGE": {

    //   const newLocation = action.payload.location;

    //   const newPath = newLocation.pathname;
    //   const { tabs } = state;

    //   console.log(
    //     "ROUTER LOCATION CHANGE",
    //     action.payload.location,
    //     newLocation.pathname
    //   );

    //   const foundMatchTabIndex = tabs.findIndex(t => t.url === newPath);
    //   const foundMatchTab =
    //     foundMatchTabIndex !== -1 ? tabs[foundMatchTabIndex] : undefined;

    //   const foundStartTabIndex = tabs.findIndex(
    //     t => newPath.includes(t.url) || t.url.includes(newPath)
    //   );

    //   console.log("START TAB INDEX", foundStartTabIndex, tabs);

    //   const foundStartTab =
    //     foundStartTabIndex !== -1 ? tabs[foundStartTabIndex] : undefined;

    //   console.log("FOUND TAB INFO");
    //   console.log(tabs, foundMatchTab, foundStartTab);

    //   if (foundMatchTab) {
    //     return { ...state, currentTabId: foundMatchTab.id };
    //   }

    //   if (foundStartTab) {
    //     console.log("FOUND START TAB", foundStartTab, tabs);

    //     let updatedTabs = [...tabs];
    //     const newTab = {
    //       ...foundStartTab,
    //       url: newLocation.pathname,
    //     };
    //     console.log("NEW TAB", newTab);
    //     updatedTabs.splice(foundStartTabIndex, 1, newTab);

    //     console.log("UPDATED TABS", updatedTabs);

    //     return { ...state, tabs: updatedTabs, currentTabId: newTab.id };
    //   }

    //   if (foundStartTab === undefined && foundMatchTab === undefined) {

    //     console.log("CREATING NEW TAB FOR ", newLocation);
    //     const newTab = createTabObject(
    //       newLocation.pathname,
    //       newLocation.pathname
    //     );
    //     return {
    //       ...state,
    //       tabs: [...state.tabs, newTab],
    //       currentTabId: newTab.id,
    //     };
    //   }

    //   return state;
    // }

    default: {
      return state;
    }
  }
}
