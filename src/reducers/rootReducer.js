import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import { reducer as appReducer, type State as AppState } from "../ducks/app";
import identityDuck, {
  type State as IdentityState,
} from "../ducks/identity/index.js";
import userDuck, { type State as UserState } from "../ducks/user";
import { reducer as authReducer, type State as AuthState } from "../ducks/auth";
import {
  reducer as friendReducer,
  type State as FriendState,
} from "../ducks/friends";
import {
  reducer as groupReducer,
  type State as GroupState,
} from "../ducks/groups/index";

import {
  reducer as messagesReducer,
  type State as MessagesState,
} from "../ducks/messages";

import { reducer as tabsReducer, type State as TabsState } from "../ducks/tabs";

export type GlobalState = {
  identity: IdentityState,
  user: UserState,
  auth: AuthState,
  app: AppState,
  friends: FriendState,
  groups: GroupState,
  messages: MessagesState,
  tabs: TabsState,
};

export default combineReducers({
  identity: identityDuck,
  user: userDuck.reducer,
  app: appReducer,
  auth: authReducer,
  friends: friendReducer,
  groups: groupReducer,
  messages: messagesReducer,
  tabs: tabsReducer,
  router: routerReducer,
});
