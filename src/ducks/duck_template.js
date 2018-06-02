// @flow

import { type GlobalState } from "../reducers/rootReducer";

// State
// Type definitions and initial state

export type State = {
  arr: Array<any>
};

const initialState: State = {
  arr: []
};

// Action Types
// Type definitions

type NameAction = {
  type: "NAME",
  payload: any
};

type Action = NameAction | NameAction;

// Middleware action types

type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => GlobalState) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// Action creators

export function doNameAction(args: any): NameAction {
  return {
    type: "NAME",
    payload: {}
  };
}

// Reducer

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "NAME": {
      return {
        ...state
      };
    }
    default:
      return state;
  }
}

export default reducer;
