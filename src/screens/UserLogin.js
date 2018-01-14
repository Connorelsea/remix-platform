import React, { Component } from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import Button from "../components/Button"
import AppScrollContainer from "../components/AppScrollContainer"
import TextInput from "../components/TextInput"

import { query, mutate } from "../utilities/gql_util"

import { bind } from "decko"

export default class UserLogin extends Component {
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
  }

  attemptPhoneLogin(phone_number, password) {
    mutate(
      `
      mutation loginUserWithPhone($email: String!, $password: String!) {
        loginUserWithPhone(email: $email, password: $password) {
          id, token
        }
      }
    `,
      { phone_number, password }
    )
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
    const { loginCredential, loginPassword, loginCredentialType } = this.state
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

const Text = styled.Text`
  font-size: 17px;
  margin-bottom: 12px;
`
