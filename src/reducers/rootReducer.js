import { combineReducers } from "redux"
import appDuck from "../ducks/app"
import userDuck from "../ducks/user"
import authDuck from "../ducks/auth"

export type GlobalState = {
  auth: authDuck.State,
  user: userDuck.State,
}

export default combineReducers({
  user: userDuck.reducer,
  app: appDuck,
  auth: authDuck,
})
