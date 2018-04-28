// @flow

import React, { Component, Fragment, type Node } from "react";
import { connect } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Home from "../screens/Home";
import { bind } from "decko";
import ExpiredRefreshToken from "../screens/ExpiredRefreshToken";
import UserLogin from "../screens/UserLogin";
import UserCreate from "../screens/UserCreate";
import { type Device } from "../types/device";
import { CurrentDeviceSelector } from "../ducks/auth";
import NewDashboard from "../screens/NewDashboard";

type Props = {
  expiredRefreshToken: boolean,
  authenticated: boolean,
  devices: Array<Device>,
  currentDevice: Device
};

class App extends Component<Props> {
  render(): Node {
    const { expiredRefreshToken, authenticated } = this.props;

    if (expiredRefreshToken) return this.viewExpiredRefreshToken();
    if (authenticated) return this.viewUser();
    return this.viewNonUser();
  }

  /**
   * View: Remix app structure for unauthenticated user.
   *
   * Render the Remix general website layout for unauthenticated
   * users. This includes login, create user, and promotional content.
   */
  viewNonUser(): Node {
    return (
      <BrowserRouter>
        <Fragment>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={UserLogin} />
          <Route exact path="/create" component={UserCreate} />
        </Fragment>
      </BrowserRouter>
    );
  }

  /**
   * View: Remix app structure for authenticated user
   */
  viewUser(): Node {
    return (
      <BrowserRouter>
        <Fragment>
          <Route exact path="/" component={NewDashboard} />
        </Fragment>
      </BrowserRouter>
    );
  }

  /**
   * View: Expired Refresh Token
   */
  @bind
  viewExpiredRefreshToken(): Node {
    const { currentDevice } = this.props;
    return (
      <BrowserRouter>
        <ExpiredRefreshToken currentDevice={currentDevice} />
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state: GlobalState) {
  return {
    expiredRefreshToken: state.auth.expiredRefreshToken,
    authenticated: state.auth.authenticated,
    currentDevice: CurrentDeviceSelector(state)
  };
}

export default connect(mapStateToProps)(App);
