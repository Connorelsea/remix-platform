// @flow

import React from "react";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader";
import AppStateManager from "./AppStateManager";
import DataManager from "../components/DataManager";
import store from "../utilities/storage/store";
import App from "./NewApp";
import { type State, loginWithCurrentDevice } from "../ducks/auth";

class Container extends React.Component<{}> {
  // needs to run after store is init from localstorage
  onAppStart() {
    console.log("[AppStart] Checking for current device");

    const state: State = store.getState().auth;
    if (state.currentDeviceId) store.dispatch(loginWithCurrentDevice());
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
            <App />
          </AppStateManager>
        </DataManager>
      </Provider>
    );
  }
}

export default hot(module)(Container);
