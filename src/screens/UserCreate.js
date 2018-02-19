import React, { Component } from "react"
import styled from "styled-components/native"
import { withRouter } from "react-router"
import Button from "../components/Button"
import AppScrollContainer from "../components/AppScrollContainer"
import TextInput from "../components/Input"
import { mutate } from "../utilities/gql_util"
import { bind } from "decko"
import ColorPicker from "../components/ColorPicker"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import styles from "../utilities/styles"
import MessageMock from "../components/MessageMock"
import Card from "../components/Card"
import { View } from "react-native"

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
    messages: [],
  }

  @bind
  onColorChange(color) {
    this.setState({ color })
  }

  render() {
    const { name, color } = this.state
    return (
      <AppScrollContainer title="New User">
        <Text tier="thintitle">Personal Color</Text>
        <Spacing size={10} />
        <Text tier="subtitle">What color are you?</Text>
        <Spacing size={15} />
        <ColorPicker onColorChange={this.onColorChange} />
        <Spacing size={30} />

        <FlexContainer>
          <SubContainer>
            <Text tier="thintitle">Your Messages</Text>
            <Spacing size={10} />
            <Text tier="subtitle">
              This is what your messages will look like to other users
            </Text>
            <Spacing size={15} />
            <Card>
              <Spacing size={15} />
              <MessageMock
                text={"Welcome to Remix!"}
                color={styles.colors.grey[200]}
              />
              <MessageMock
                text={`Thank you ` + (name ? `- I'm ${name}` : "")}
                name={name}
                color={color}
                currentUser
              />
              <Spacing size={10} />
            </Card>
          </SubContainer>

          <SubContainer>
            <Text tier="thintitle">Profile</Text>
            <Spacing size={10} />
            <Text tier="subtitle">
              Enter some basic information to get started.
            </Text>
            <Spacing size={15} />
            <Text tier="label">Email</Text>
            <Spacing size={5} />
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
            <Spacing size={15} />
            <Text tier="label">Username</Text>
            <Spacing size={5} />
            <TextInput
              placeholder="Username"
              onChangeText={this.onTextChangeFor("username")}
              value={this.state.username}
            />
            <Spacing size={15} />
            <Text tier="label">Password</Text>
            <Spacing size={5} />
            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={this.onTextChangeFor("password")}
              value={this.state.password}
            />
            <Spacing size={15} />
            <Text tier="label">Display Name</Text>
            <Spacing size={5} />
            <TextInput
              placeholder="Display or Full Name"
              onChangeText={this.onTextChangeFor("name")}
              value={this.state.name}
            />
            <Spacing size={20} />
            <Button onPress={this.onCreatePress} title="Join Remix" />
          </SubContainer>
        </FlexContainer>

        <Spacing size={35} />
      </AppScrollContainer>
    )
  }
}

const FlexContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const SubContainer = styled.View`
  align-items: flex-start;
  width: 45%;
`

export default withRouter(UserLogin)
