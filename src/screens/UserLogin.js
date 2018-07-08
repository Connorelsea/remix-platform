import React, { Component } from "react";
import styled from "styled-components";
import Button from "../elements/Button";
import AppScrollContainer from "../components/AppScrollContainer";
import Input from "../components/Input";
import { mutate } from "../utilities/gql_util";
import { bind } from "decko";
import { set, get, getArray, exists } from "../utilities/storage";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import User from "../ducks/user";
import { View } from "react-native";
import Spacing from "../components/Spacing";
import Text from "../components/Text";
import Card from "../components/Card";
import FlexContainer from "../components/FlexContainer";
import DeviceCard from "../components/DeviceCard";
import Box from "../elements/Box";
import { Platform } from "react-native";
import UAParser from "ua-parser-js";
import {
  setCurrentDeviceId,
  addDevice,
  loginWithCurrentDevice,
} from "../ducks/auth";
import ScrollContainer from "../elements/ScrollContainer";
import ContentContainer from "../elements/ContentContainer";

class UserLogin extends Component {
  getDeviceMeta() {
    if (Platform.OS === "web") {
      const agent = new UAParser();

      console.log("CPU", agent.getCPU());

      return {
        operatingSystem:
          agent.getDevice().vendor + " " + agent.getDevice().model,
        browser: agent.getBrowser().name + ";" + agent.getBrowser().version,
        cpu: agent.getCPU().architecture || "Unknown",
        gpu: "Unknown",
      };
    }

    return {
      operatingSystem: "Unknown",
      browser: "Unknown",
      cpu: "Unknown",
      gpu: "Unknown",
    };
  }

  @bind
  attemptEmailLogin(email, password) {
    const { operatingSystem, browser, cpu, gpu } = this.getDeviceMeta();

    mutate(
      `
      mutation loginWithNewDevice(
        $email: String!
        $password: String!
        $deviceName: String
        $operatingSystem: String!
        $browser: String!
        $cpu: String!
        $gpu: String!
      ) {
        loginWithNewDevice(
          email: $email
          password: $password
          deviceName: $deviceName
          operatingSystem: $operatingSystem
          browser: $browser
          cpu: $cpu
          gpu: $gpu
        ) {
          id
          user {
            id
            name
            email
            username
          }
          refreshToken
          accessToken
        }
      }
    `,
      { email, password, operatingSystem, browser, cpu, gpu }
    )
      .then(this.processLoginResponse)
      .catch(err => {
        console.log("USER LOGIN ERROR ", err);
        this.setState({
          error: err,
        });
      });
  }

  @bind
  async processLoginResponse(response) {
    const {
      addDevice,
      setCurrentDeviceId,
      loginWithCurrentDevice,
    } = this.props;
    const device = response.data.loginWithNewDevice;

    addDevice(device);
    setCurrentDeviceId(device.id);
    loginWithCurrentDevice();

    this.props.history.push("/");
  }

  state = {
    loginCredential: undefined,
    loginPassword: undefined,
    loginCredentialType: "email",
  };

  @bind
  onChangeCredential(text) {
    this.setState({ loginCredential: text });
  }

  @bind
  onChangePassword(text) {
    this.setState({ loginPassword: text });
  }

  @bind
  async onLoginPress() {
    const {
      loginCredential,
      loginPassword /* loginCredentialType */,
    } = this.state;

    this.attemptEmailLogin(loginCredential, loginPassword);
  }

  renderDevices() {
    const { devices } = this.state;

    if (devices) {
      return (
        <Box>
          <Text tier="thintitle">Devices</Text>
          <Spacing size={5} />
          <Text tier="subtitle">
            Login using an account linked to this device
          </Text>
          <Spacing size={15} />
          {devices.map(d => <DeviceCard {...d} />)}
          <Spacing size={20} />
        </Box>
      );
    }
  }

  render() {
    const { devices, error } = this.state;

    return (
      <ScrollContainer>
        <ContentContainer>
          <Box column padding="25px">
            {this.renderDevices()}

            <Text tier="thintitle">Login</Text>
            <Spacing size={5} />
            <Text tier="subtitle">
              Login using your email address and password.
            </Text>
            <Spacing size={15} />
            <Text tier="label">Email Address</Text>
            <Spacing size={5} />
            <Input
              placeholder="Email Address"
              value={this.state.loginCredential}
              onChangeText={this.onChangeCredential}
            />
            <Spacing size={15} />
            <Text tier="label">Password</Text>
            <Spacing size={5} />
            <Input
              placeholder="Password"
              secureTextEntry
              value={this.state.loginPassword}
              onChangeText={this.onChangePassword}
            />
            <Spacing size={30} />
            {error && [
              <Text tier="error">
                There was an error logging in, try again.
              </Text>,
              <Spacing size={10} />,
              <Text tier="body">{error.name}</Text>,
              <Text tier="body">{error.message}</Text>,
              <Text tier="body">{JSON.stringify(error, null, 2)}</Text>,
              <Spacing size={20} />,
            ]}
            <Button onClick={this.onLoginPress} title="Login" />
          </Box>
        </ContentContainer>
      </ScrollContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addDevice: device => dispatch(addDevice(device)),
    setCurrentDeviceId: id => dispatch(setCurrentDeviceId(id)),
    loginWithCurrentDevice: id => dispatch(loginWithCurrentDevice()),
  };
}

function mapStateToProps(state, props) {
  return {};
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserLogin)
);
