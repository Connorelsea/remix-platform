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
import styles from "../utilities/styles"
import Message from "../components/Message"

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
      { email, phone_number, username, password, name, description, color }
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
    const { name, color } = this.state

    return (
      <AppScrollContainer title="New User">
        <Text tier="subtitle">Personal Color</Text>
        <Spacing size={5} />
        <Text tier="body">What color are you?</Text>
        <Spacing size={15} />
        <ColorPicker onColorChange={this.onColorChange} />
        <Spacing size={30} />
        <Text tier="subtitle">Your Messages</Text>
        <Spacing size={5} />
        <Text tier="body">
          This is what your messages will look like to other users
        </Text>
        <Spacing size={15} />
        <Message
          content={{ type: "remix/text", data: { text: "Message text" } }}
          user={{ id: -1, name, color }}
          prev={{}}
          currentUser={{ id: -2 }}
        />
        <Spacing size={30} />
        <Text tier="subtitle">Account Credentials</Text>
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
        <Spacing size={30} />
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
        <Spacing size={30} />
        <Button onPress={this.onCreatePress} title="Join Remix" />
      </AppScrollContainer>
    )
  }
}

const Bubble = styled.View`
  padding: 10px 12px;
  border-radius: 20px;
  background-color: ${({ color }) => color || styles.colors.grey[200]};
  max-width: 300px;
`

export default withRouter(UserLogin)
