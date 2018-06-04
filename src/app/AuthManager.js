import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type GlobalState } from "../reducers/rootReducer";
import { type Device } from "../types/device";
import ExpiredRefreshToken from "../screens/ExpiredRefreshToken";
import { ConnectedRouter } from "react-router-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import history from "../utilities/storage/history";
import Home from "../screens/Home";
import UserLogin from "../screens/UserLogin";
import UserCreate from "../screens/UserCreate";
import { CurrentDeviceSelector } from "../ducks/auth";

type Props = {
  expiredRefreshToken: boolean,
  authenticated: boolean,
  currentDevice: Device,
};

type State = {};

class AuthManager extends Component<Props, State> {
  state = {};

  render(): Node {
    const {
      expiredRefreshToken,
      authenticated,
      currentDevice,
      children,
      location,
    } = this.props;

    if (expiredRefreshToken) {
      return <ExpiredRefreshToken currentDevice={currentDevice} />;
    }

    if (!authenticated) {
      return (
        <Switch location={location}>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={UserLogin} />
          <Route exact path="/create" component={UserCreate} />
        </Switch>
      );
    } else {
      return children;
    }
  }
}

function mapStateToProps(state: GlobalState) {
  return {
    expiredRefreshToken: state.auth.expiredRefreshToken,
    authenticated: state.auth.authenticated,
    currentDevice: CurrentDeviceSelector(state),
  };
}

export default withRouter(connect(mapStateToProps)(AuthManager));
