import React, { Component } from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
import { withRouter } from "react-router"

import Button from "../components/Button"
import AppScrollContainer from "../components/AppScrollContainer"
import TextInput from "../components/TextInput"

import { query, mutate } from "../utilities/gql_util"

import { bind } from "decko"

const Route = Routing.Route
const Link = Routing.Link

class UserLogin extends Component {
  attemptCreateUser({
    email,
    phone_number,
    username,
    password,
    name,
    description,
  }) {
    mutate(
      `
      mutation createUser(
        $email: String,
        $phone_number: String,
        $username: String,
        $password: String,
        $name: String,
        $description: String,
      ) {
        createUser(
          email: $email,
          phone_number: $phone_number,
          username: $username,
          password: $password,
          name: $name,
          description: $description,
        ) {
          id, token
        }
      }
    `,
      { email, phone_number, username, password, name, description }
    )
      .then(() => {
        this.props.history.push("/create/done")
      })
      .catch(error => {})
  }

  @bind
  onCreatePress() {
    const {} = this.state
    this.attemptCreateUser(this.state)
  }

  onTextChangeFor(name) {
    return value => this.setState({ [name]: value })
  }

  state = {}

  render() {
    return (
      <AppScrollContainer title="New User">
        <TextInput
          placeholder="Email"
          onChangeText={this.onTextChangeFor("email")}
          value={this.state.email}
        />
        <TextInput
          placeholder="Phone Number"
          onChangeText={this.onTextChangeFor("phone_number")}
          value={this.state.phone_number}
        />
        <TextInput
          placeholder="Username"
          secureTextEntry
          onChangeText={this.onTextChangeFor("username")}
          value={this.state.username}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={this.onTextChangeFor("password")}
          value={this.state.password}
        />
        <TextInput
          placeholder="Display or Full Name"
          secureTextEntry
          onChangeText={this.onTextChangeFor("name")}
          value={this.state.name}
        />
        <TextInput
          placeholder="Description / Bio / Info"
          secureTextEntry
          onChangeText={this.onTextChangeFor("description")}
          value={this.state.description}
        />
        <Button onPress={this.onCreatePress} title="Join Remix" />
      </AppScrollContainer>
    )
  }
}

export default withRouter(UserLogin)

const Text = styled.Text`
  font-size: 17px;
  margin-bottom: 12px;
`
