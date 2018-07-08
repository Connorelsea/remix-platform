import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "../../reducers/rootReducer";
import persistState, {
  mergePersistedState,
  transformState,
} from "redux-localstorage";
import adapter from "redux-localstorage/lib/adapters/localStorage";
import filter from "redux-localstorage-filter";
import { defaultApolloClient } from "../../ducks/auth";
import history from "./history";
import { connectRouter, routerMiddleware } from "connected-react-router";

let initialState = {};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = compose(
  connectRouter(history),
  mergePersistedState((initialState, persistState) => {
    console.log(
      "[Store] Merging in persisted state",
      initialState,
      persistState
    );

    return {
      ...initialState,
      ...persistState,
      auth: {
        ...persistState.auth,
        authenticated: false,
        apolloClient: defaultApolloClient,
      },
      app: initialState.app,
    };
  })
)(rootReducer);

const storage = compose(
  filter([
    "friends",
    "identity",
    "auth.devices",
    "auth.currentDeviceId",
    "app",
    "user",
  ])
)(adapter(window.localStorage));

const enhancer = composeEnhancers(
  applyMiddleware(routerMiddleware(history), thunk),
  persistState(storage, "remix-local-storage")
);

const store = createStore(reducer, initialState, enhancer);

export default store;
