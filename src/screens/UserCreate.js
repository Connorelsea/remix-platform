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
import FlexContainer from "../components/FlexContainer"
import FlexContainerItem from "../components/FlexContainerItem"
import { set } from "../utilities/storage"

class UserLogin extends Component {
  @bind
  attemptCreateUser({
    email,
    username,
    password,
    name,
    description,
    color,
    iconUrl,
  }) {
    mutate(
      `
      mutation createUser(
        $email: String
        $username: String
        $password: String
        $name: String
        $description: String
        $color: String
        $iconUrl: String
      ) {
        createUser(
          email: $email
          username: $username
          password: $password
          name: $name
          description: $description
          color: $color
          iconUrl: $iconUrl
        ) {
          id
          userId
          refreshToken
          accessToken
        }
      }`,
      {
        email,
        username,
        password,
        name,
        description,
        color,
        iconUrl,
      }
    )
      .then(res => {
        const { data: { createUser } } = res

        set("previousEmail", email)
        set("userId", createUser.userId)
        set("deviceId", createUser.id)
        set("accessToken", createUser.accessToken)
        set("refreshToken", createUser.refreshToken)

        this.props.history.push("/login")
      })
      .catch(error => {
        this.setState({
          errors: [
            {
              key: "form",
              error:
                "There was a server side error. Review your inputs and try again",
            },
          ],
        })
        console.log(error)
      })
  }

  @bind
  onCreatePress() {
    const { color, email, username, password, name } = this.state

    let errors = []

    if (color === "") {
      errors.push({
        key: "color",
        error: "Choose a personal color above",
      })
    }

    if (!email) {
      errors.push({
        key: "email",
        error: "Enter your email",
      })
    } else if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.push({
        key: "email",
        error: "Enter a valid email address",
      })
    }

    if (!username) {
      errors.push({
        key: "username",
        error: "Enter a username",
      })
    } else if (username.includes(" ")) {
      errors.push({
        key: "username",
        error: "Username cannot contain whitespace",
      })
    } else if (!username.match(/^[a-z0-9]+$/i)) {
      errors.push({
        key: "username",
        error: "Username must only contain letters and numbers",
      })
    }

    if (!name) {
      errors.push({
        key: "name",
        error: "Enter your display name",
      })
    }

    if (!password) {
      errors.push({
        key: "password",
        error: "Enter a password",
      })
    } else if (password.trim().length < 4) {
      errors.push({
        key: "password",
        error: "Enter a longer password",
      })
    }

    if (errors.length === 0) {
      this.setState({ errors: [] })
      this.attemptCreateUser(this.state)
    } else this.setState({ errors })
  }

  onTextChangeFor(name) {
    return value => this.setState({ [name]: value })
  }

  state = {
    color: "",
    messages: [],
    errors: [],
  }

  @bind
  onColorChange(color) {
    this.setState({ color })
  }

  @bind
  fieldHasError(field) {
    let errors = this.state.errors.find(e => e.key === field)
    if (!errors) return false
    if (errors.length > 0) return true
    return false
  }

  render() {
    const { name, color, errors } = this.state
    return (
      <AppScrollContainer title="New User">
        <Text tier="thintitle">Personal Color</Text>
        <Spacing size={10} />
        <Text tier="subtitle">What color are you?</Text>
        <Spacing size={15} />
        <ColorPicker onColorChange={this.onColorChange} />
        <Spacing size={30} />

        <FlexContainer>
          <FlexContainerItem>
            <Text tier="thintitle">Your Messages</Text>
            <Spacing size={10} />
            <Text tier="subtitle">
              This is what your messages will look like to other users
            </Text>
            <Spacing size={15} />
            <Card>
              <Spacing size={10} />
              <Text tier="title">{name ? name : "Display Name"}</Text>
              <Spacing size={10} />
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
          </FlexContainerItem>

          <Spacing size={25} />

          <FlexContainerItem>
            <Text tier="thintitle">Profile</Text>
            <Spacing size={10} />
            <Text tier="subtitle">
              Enter some basic information to get started.
            </Text>

            {errors.length > 0 && [
              <Spacing size={15} />,
              [errors.map(e => <Text tier="error">{e.error}</Text>)],
              <Spacing size={10} />,
              <Text tier="body">Once fixed, try to join again</Text>,
            ]}

            <Spacing size={15} />
            <Text tier="label">Email</Text>
            <Spacing size={5} />
            <TextInput
              placeholder="Email"
              onChangeText={this.onTextChangeFor("email")}
              value={this.state.email}
              type="email"
            />

            <Spacing size={15} />
            <Text
              tier={this.fieldHasError("username") ? "labelerror" : "label"}
            >
              Username
            </Text>
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
            <Spacing size={20} />
          </FlexContainerItem>
        </FlexContainer>

        <Spacing size={35} />
      </AppScrollContainer>
    )
  }
}

export default withRouter(UserLogin)
