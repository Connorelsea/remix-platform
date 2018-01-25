import { combineReducers } from "redux"
import userDuck from "../ducks/user"

export default combineReducers({
  user: userDuck.reducer,
})
