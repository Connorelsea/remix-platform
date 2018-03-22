import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import rootReducer from "../../reducers/rootReducer"
import persistState, { mergePersistedState } from "redux-localstorage"
import adapter from "redux-localstorage/lib/adapters/localStorage"
import filter from "redux-localstorage-filter"

let initialState = {}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducer = compose(
  mergePersistedState((initialState, persistState) => {
    return {
      ...initialState,
      ...persistState,
      auth: {
        ...initialState.auth,
        authenticated: false,
      },
    }
  })
)(rootReducer)

const storage = adapter(window.localStorage)

const enhancer = compose(
  applyMiddleware(thunk),
  persistState(storage, "remix-local-storage")
)

const store = createStore(reducer, initialState, enhancer)

export default store
