import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
import { withRouter } from "react-router"

import Button from "../components/Button"
import AppScrollContainer from "../components/AppScrollContainer"
import TextInput from "../components/TextInput"

import { query, mutate } from "../utilities/gql_util"

import { bind } from "decko"
import ColorPicker from "../components/ColorPicker"
import Text from "../components/Text"
import Spacing from "../components/Spacing"

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
    color,
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
        $color: String,
      ) {
        createUser(
          email: $email,
          phone_number: $phone_number,
          username: $username,
          password: $password,
          name: $name,
          description: $description,
          color: $color
        ) {
          id, token
        }
      }
    `,
      { email, phone_number, username, password, name, description }
    )
      .then(() => {
        this.props.history.push("/")
      })
      .catch(error => {
        console.log(error)
      })
  }

  @bind
  onCreatePress() {
    const {} = this.state
    this.attemptCreateUser(this.state)
  }

  onTextChangeFor(name) {
    return value => this.setState({ [name]: value })
  }

  state = {
    color: "",
  }

  @bind
  onColorChange(color) {
    this.setState({ color })
  }

  render() {
    return (
      <AppScrollContainer title="New User">
        <Text tier="subtitle">Personal Color</Text>
        <Spacing size={5} />
        <Text tier="body">
          What color are you? This will be the color your messages appear to
          everyone else.
        </Text>
        <Spacing size={15} />
        <ColorPicker onColorChange={this.onColorChange} />
        <Spacing size={20} />
        <Text tier="subtitle">Account Credentials</Text>
        <Spacing size={15} />
        <TextInput
          placeholder="Email"
          onChangeText={this.onTextChangeFor("email")}
          value={this.state.email}
        />
        {/* <TextInput
          placeholder="Phone Number"
          onChangeText={this.onTextChangeFor("phone_number")}
          value={this.state.phone_number}
        /> */}
        <TextInput
          placeholder="Username"
          onChangeText={this.onTextChangeFor("username")}
          value={this.state.username}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={this.onTextChangeFor("password")}
          value={this.state.password}
        />
        <Spacing size={10} />
        <Text tier="subtitle">About You</Text>
        <TextInput
          placeholder="Display or Full Name"
          onChangeText={this.onTextChangeFor("name")}
          value={this.state.name}
        />
        <TextInput
          placeholder="Description / Bio / Info"
          onChangeText={this.onTextChangeFor("description")}
          value={this.state.description}
        />
        <Button onPress={this.onCreatePress} title="Join Remix" />
      </AppScrollContainer>
    )
  }
}

export default withRouter(UserLogin)
