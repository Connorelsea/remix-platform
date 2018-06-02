// @flow

import React, { Fragment, Component, type Node } from "react";
import { connect } from "react-redux";
import AppScrollContainer from "../components/AppScrollContainer";
import { View } from "react-native";
import Text from "../components/Text";
import Title from "../elements/Title";
import Box from "../elements/Box.web";
import Paragraph from "../elements/Paragraph";
import styles from "../utilities/styles";
import Spacing from "../components/Spacing";
import { type Device } from "../types/device";
import DeviceCard from "../components/DeviceCard";
import { bind } from "decko";
import { type User } from "../types/user";

import ProvideUsers, {
  type ProvideUsersRenderProps,
} from "../providers/ProvideUsers";
import { withTheme } from "styled-components";
import Subtitle from "../elements/Subtitle";
import TextInput from "../elements/TextInput";
import Button from "../elements/Button";

import debounce from "lodash/debounce";
import { getNewRefreshToken, loginWithCurrentDevice } from "../ducks/auth";
import { GlobalState } from "../reducers/rootReducer";

type Props = {
  theme: any,
  users: Array<User>,
  currentDevice: Device,
  dispatchGetNewRefreshToken: (
    deviceId: string,
    email: string,
    password: string
  ) => Device,
  dispatchLoginWithCurrentDevice: () => any,
};

type State = {
  password: string,
  passwordIsValid: boolean,
  loginIsDisabled: boolean,
  passwordInfoState: PasswordInfoState,
};

type PasswordInfoState = "UNTOUCHED" | "LOADING" | "SUCCESS" | "FAILURE";

class ExpiredRefreshToken extends Component<Props, State> {
  state = {
    password: "",
    passwordIsValid: false,
    loginIsDisabled: true,
    passwordInfoState: "UNTOUCHED",
  };

  debounced_onPasswordStopTyping = debounce(this.onPasswordStopTyping, 1500);

  @bind
  onPasswordChange(event: Event) {
    const password = event.target.value;
    this.setState({
      password,
      loginIsDisabled: true,
      passwordInfoState: "LOADING",
    });
    console.log("password:onChange");
    this.debounced_onPasswordStopTyping();
  }

  @bind
  async onPasswordStopTyping() {
    const { currentDevice, users, dispatchGetNewRefreshToken } = this.props;
    const { password } = this.state;

    console.log("password:stopTyping", this.state.password);
    console.log(users);

    const response = await dispatchGetNewRefreshToken(
      currentDevice.id,
      users.find(u => u.id === currentDevice.user.id).email,
      password
    );

    if (response) {
      this.setState({ loginIsDisabled: false, passwordInfoState: "SUCCESS" });
    } else {
      this.setState({ loginIsDisabled: true, passwordInfoState: "FAILURE" });
    }
  }

  @bind
  onClickLogin() {
    const { dispatchLoginWithCurrentDevice } = this.props;
    dispatchLoginWithCurrentDevice();
  }

  @bind
  viewPasswordInfoState(passwordInfoState): Node {
    const { theme } = this.props;
    let elements: Array<Node> = [<Spacing size={10} />];

    if (passwordInfoState === "LOADING") {
      elements.push(<Paragraph>Checking if password is correct...</Paragraph>);
    } else if (passwordInfoState === "SUCCESS") {
      elements.push(
        <Paragraph color={theme.text.success}>Password is correct</Paragraph>
      );
    } else if (passwordInfoState === "FAILURE") {
      elements.push(
        <Paragraph color={theme.text.failure}>Password is incorrect</Paragraph>
      );
    }

    return elements;
  }

  @bind
  renderBody(renderProps: ProvideUsersRenderProps): Node {
    const { currentDevice, theme } = this.props;
    const { password, loginIsDisabled, passwordInfoState } = this.state;
    const { users, usersLoading } = renderProps;
    const { onClickLogin } = this;

    if (usersLoading) return <div>Loading</div>;

    return (
      <Box
        full
        alignCenter
        column
        padding="20px"
        backgroundColor={theme.background.secondary}
      >
        <Spacing size={25} />
        <Title type="THIN" size="LARGE">
          Password Expired
        </Title>
        <Spacing size={25} />
        <Paragraph center>
          Re-enter your password. For your security, this device asks for your
          password every three days.
        </Paragraph>
        <Spacing size={25} />
        <Paragraph center>
          To enter your password less often, trust this device. Only trust safe
          devices that are personal and unshared. Learn More
        </Paragraph>
        <Spacing size={15} />

        <Box full alignStart column>
          <Subtitle>Current User</Subtitle>
          <Spacing size={10} />
          <DeviceCard
            device={currentDevice}
            user={users.find(u => u.id === currentDevice.user.id)}
          />
          <Spacing size={25} />

          <Subtitle>Re-enter your password</Subtitle>
          <Spacing size={10} />

          <Box fullWidth>
            <TextInput
              value={password}
              placeholder="Password"
              secure
              onChange={this.onPasswordChange}
            />
            <Spacing size={10} />
            <Button
              title="Login"
              size="MEDIUM"
              type="EMPHASIS"
              disabled={loginIsDisabled}
              onClick={onClickLogin}
            />
          </Box>

          {this.viewPasswordInfoState(passwordInfoState)}

          {passwordInfoState === "SUCCESS" && (
            <Fragment>
              <Spacing size={25} />
              <Subtitle>Device Options</Subtitle>
              <Spacing size={10} />

              <Box>
                <Button title="Trust" size="SMALL" />
                <Spacing size={10} />
                <Button title="Change Password" size="SMALL" />
                <Spacing size={10} />
                <Button title="Delete Device" size="SMALL" />
                <Spacing size={10} />
              </Box>
            </Fragment>
          )}

          <Spacing size={25} />
          <Subtitle>Not you?</Subtitle>
          <Spacing size={10} />

          <Box>
            <Button title="Change Account" size="SMALL" />
          </Box>

          <Spacing size={10} />
        </Box>
      </Box>
    );
  }

  render(): Node {
    const { currentDevice } = this.props;

    return (
      <ProvideUsers
        userIds={[currentDevice.user.id]}
        render={this.renderBody}
      />
    );
  }
}

function mapStateToProps(state: GlobalState) {
  return {
    users: state.identity.users,
  };
}

function mapDispatchToProps(dispatch, getState) {
  return {
    dispatchGetNewRefreshToken: (deviceId, email, password) =>
      dispatch(getNewRefreshToken(deviceId, email, password)),
    dispatchLoginWithCurrentDevice: () => dispatch(loginWithCurrentDevice()),
  };
}

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(ExpiredRefreshToken)
);
