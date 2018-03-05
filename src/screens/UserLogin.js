import React, { Component } from "react"
import styled from "styled-components/native"
import Button from "../components/Button"
import AppScrollContainer from "../components/AppScrollContainer"
import Input from "../components/Input"
import { mutate } from "../utilities/gql_util"
import { bind } from "decko"
import { set, get } from "../utilities/storage"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import User from "../ducks/user"
import { View } from "react-native"
import Spacing from "../components/Spacing"
import Text from "../components/Text"

class UserLogin extends Component {
  @bind
  attemptEmailLogin(email, password, deviceId) {
    mutate(
      `
      mutation loginUserWithEmail(
        $email: String!
        $password: String!
        $deviceId: ID!
      ) {
        loginUserWithEmail(
          email: $email
          password: $password
          deviceId: $deviceId
        ) {
          id
          userId
          refreshToken
          accessToken
        }
      }
    `,
      { email, password, deviceId }
    )
      .then(this.processLoginResponse)
      .catch(err => {
        console.log("USER LOGIN ERROR ", err)
        this.setState({
          error: err,
        })
      })
  }

  @bind
  async processLoginResponse(response) {
    console.log("LOGIN RESPONSE", response)

    const {
      data: { loginUserWithEmail: { id, userId, refreshToken, accessToken } },
    } = response

    await set("accessToken", accessToken)
    await set("refreshToken", refreshToken)
    await set("userId", userId)
    await set("deviceId", id)

    this.props.loadInitialUser(userId)
    this.props.history.replace("/", "")
  }

  state = {
    loginCredential: undefined,
    loginPassword: undefined,
    loginCredentialType: "email",
  }

  @bind
  onChangeCredential(text) {
    this.setState({ loginCredential: text })
  }

  @bind
  onChangePassword(text) {
    this.setState({ loginPassword: text })
  }

  @bind
  async onLoginPress() {
    const {
      loginCredential,
      loginPassword /* loginCredentialType */,
    } = this.state

    const deviceId = await get("deviceId")

    this.attemptEmailLogin(loginCredential, loginPassword, deviceId)
  }

  @bind
  async checkPreviousEmail() {
    const val = await get("previousEmail")
    if (val || val.trim().length < 1)
      this.setState({
        previousEmail: val,
        loginCredential: val,
      })
  }

  @bind
  clearPreviousEmail() {
    set("previousEmail", "")
    this.setState({
      previousEmail: undefined,
      loginCredential: "",
    })
  }

  componentDidMount() {
    this.checkPreviousEmail()
  }

  render() {
    const { previousEmail, error } = this.state

    return (
      <AppScrollContainer title="Login">
        <View>
          <Text tier="body">
            Login to Remix using your email address and password.
          </Text>
          <Spacing size={15} />
          <Text tier="label">Email Address</Text>
          <Spacing size={5} />
          <Input
            placeholder="Email Address"
            value={this.state.loginCredential}
            onChangeText={this.onChangeCredential}
          />
          {previousEmail
            ? [
                <Spacing size={10} />,
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text tier="body">Is this not you?</Text>
                  <Spacing size={10} />
                  <Button
                    small
                    onPress={this.clearPreviousEmail}
                    title="Use a different email"
                  />
                </View>,
              ]
            : undefined}
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
            <Text tier="error">There was an error logging in, try again.</Text>,
            <Spacing size={10} />,
            <Text tier="body">{error.name}</Text>,
            <Text tier="body">{error.message}</Text>,
            <Text tier="body">{JSON.stringify(error, null, 2)}</Text>,
            <Spacing size={20} />,
          ]}
          <Button onPress={this.onLoginPress} title="Login" />
        </View>
      </AppScrollContainer>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToFriendRequests: id => {
      dispatch(User.creators.subscribeToFriendRequests(id))
    },
    subscribeToMessages: id => {
      dispatch(User.creators.subscribeToMessages(id))
    },
    loadInitialUser: id => dispatch(User.creators.loadInitialUser(id)),
  }
}

function mapStateToProps(state, props) {
  return {}
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserLogin)
)
