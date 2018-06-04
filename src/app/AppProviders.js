// @flow

import React from "react";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader";
import AppStateManager from "./AppStateManager";
import DataManager from "../components/DataManager";
import store from "../utilities/storage/store";
import App from "./NewApp";
import { loginWithCurrentDevice } from "../ducks/auth";
import { fetchRelevantUsers } from "../ducks/identity/index.js";
import { GlobalState } from "../reducers/rootReducer";
import ConnectedRouter from "react-router-redux/ConnectedRouter";
import history from "../utilities/storage/history";
import ResponsiveManager from "./ResponsiveManager";
import AuthManager from "./AuthManager";

class Container extends React.Component<{}> {
  // needs to run after store is init from localstorage
  onAppStart() {
    console.log("[AppStart] Checking for current device");

    const state: GlobalState = store.getState();
    const currentDeviceId = state.auth.currentDeviceId;

    if (currentDeviceId) store.dispatch(loginWithCurrentDevice());

    console.log("ATTEMPTING TO RUN FETCH RELEVANT USERS");

    store.dispatch(fetchRelevantUsers());
  }

  componentDidMount() {
    this.onAppStart();
    // setTimeout(this.onAppStart, 1500);
  }

  render() {
    return (
      <Provider store={store}>
        <DataManager>
          <AppStateManager>
            <ConnectedRouter history={history}>
              <AuthManager>
                <ResponsiveManager />
              </AuthManager>
            </ConnectedRouter>
          </AppStateManager>
        </DataManager>
      </Provider>
    );
  }
}

export default hot(module)(Container);
