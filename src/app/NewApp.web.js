// @flow

import React, { Component, Fragment, type Node } from "react";
import { connect } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { Switch, Route, Link } from "react-router-dom";
import Home from "../screens/Home";
import { bind } from "decko";
import ExpiredRefreshToken from "../screens/ExpiredRefreshToken";
import UserLogin from "../screens/UserLogin";
import UserCreate from "../screens/UserCreate";
import { type Device } from "../types/device";
import { CurrentDeviceSelector } from "../ducks/auth";
import NewDashboard from "../screens/Dashboard/index";
import TabView from "../screens/TabView";
import ConnectedRouter from "react-router-redux/ConnectedRouter";
import history from "../utilities/storage/history";

type Props = {
  expiredRefreshToken: boolean,
  authenticated: boolean,
  devices: Array<Device>,
  currentDevice: Device,
};

class App extends Component<Props> {
  render(): Node {
    return (
      <ConnectedRouter history={history}>{this.currentView()}</ConnectedRouter>
    );
  }

  @bind
  currentView() {
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
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={UserLogin} />
        <Route exact path="/create" component={UserCreate} />
      </Switch>
    );
  }

  /**
   * View: Remix app structure for authenticated user
   */
  viewUser(): Node {
    return (
      <Switch>
        <Route exact path="/" component={NewDashboard} />
        <Route component={TabView} />
      </Switch>
    );
  }

  /**
   * View: Expired Refresh Token
   */
  @bind
  viewExpiredRefreshToken(): Node {
    const { currentDevice } = this.props;
    return <ExpiredRefreshToken currentDevice={currentDevice} />;
  }
}

function mapStateToProps(state: GlobalState) {
  return {
    expiredRefreshToken: state.auth.expiredRefreshToken,
    authenticated: state.auth.authenticated,
    currentDevice: CurrentDeviceSelector(state),
  };
}

export default connect(mapStateToProps)(App);
