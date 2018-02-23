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
  attemptEmailLogin(email, password) {
    mutate(
      `
      mutation loginUserWithEmail($email: String!, $password: String!) {
        loginUserWithEmail(email: $email, password: $password) {
          id, token
        }
      }
    `,
      { email, password }
    )
      .then(this.processLoginResponse)
      .catch(err =>
        this.setState({
          error: err,
        })
      )
  }

  attemptPhoneLogin(phone_number, password) {
    mutate(
      `
      mutation loginUserWithPhone($email: String!, $password: String!) {
        loginUserWithPhone(email: $email, password: $password) {
          id, token
        }
      }c
    `,
      { phone_number, password }
    ).then(this.processLoginResponse)
  }

  @bind
  async processLoginResponse(response) {
    const { data: { loginUserWithEmail: { id, token } } } = response
    await set("token", token)
    await set("userId", id)
    this.props.loadInitialUser(id)
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
  onLoginPress() {
    const {
      loginCredential,
      loginPassword /* loginCredentialType */,
    } = this.state
    this.attemptEmailLogin(loginCredential, loginPassword)
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
            <Text tier="body">{error.message}</Text>,
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
