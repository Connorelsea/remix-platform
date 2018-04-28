import { combineReducers } from "redux";
import appDuck, { type State as AppState } from "../ducks/app";
import identityDuck, { type State as IdentityState } from "../ducks/identity";
import userDuck, { type State as UserState } from "../ducks/user";
import authDuck, { type State as AuthState } from "../ducks/auth";

export type GlobalState = {
  identity: IdentityState,
  user: UserState,
  auth: AuthState,
  app: AppState
};

export default combineReducers({
  identity: identityDuck,
  user: userDuck.reducer,
  app: appDuck,
  auth: authDuck
});
