import { themes, Theme } from "../utilities/theme";

// Middleware action types
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => State) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// ACTION TYPE DEFINITIONS

// SELECTORS

export const themeSelector = state => state.app.themes[state.app.themeIndex];

// INITIAL STATE

export type State = {
  themes: Array<Theme>,
  theme: Theme
};

const initialState: State = {
  themes,
  themeIndex: 0
};

// REDUCER

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    default:
      return state;
  }
}
