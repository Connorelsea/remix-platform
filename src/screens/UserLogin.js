import React, { Component } from "react"
import styled from "styled-components/native"
import Button from "../components/Button"
import AppScrollContainer from "../components/AppScrollContainer"
import TextInput from "../components/TextInput"
import { mutate } from "../utilities/gql_util"
import { bind } from "decko"
import { set } from "../utilities/storage"
import { withRouter } from "react-router"

class UserLogin extends Component {
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
    ).then(this.processLoginResponse)
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

  render() {
    return (
      <AppScrollContainer title="Login">
        <Text>
          If you have your password, you can log in with your email address or
          your phone number.
        </Text>
        <TextInput
          placeholder="Email or Phone Number"
          onChangeText={this.onChangeCredential}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={this.onChangePassword}
        />
        <Button onPress={this.onLoginPress} title="Login" />
      </AppScrollContainer>
    )
  }
}

export default withRouter(UserLogin)

const Text = styled.Text`
  font-size: 17px;
  margin-bottom: 12px;
`
