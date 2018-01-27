import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import User from "../ducks/user"
import AppScrollContainer from "../components/AppScrollContainer"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import { bind } from "decko"

import Input from "./Input"
import Button from "./Button"
import { mutate } from "../utilities/gql_util"

class ChatInputArea extends Component {
  state = {
    value: "",
  }

  @bind
  onChangeText(value) {
    this.setState({ value })
  }

  @bind
  async onPressSend() {
    const { value } = this.state
    const { chatId } = this.props

    const response = await mutate(`
      mutation createMessage {
        createMessage(
          type: "remix/text"
          data: { text: "${value}" }
          chatId: ${chatId}
        ) {
          id
        }
      }
    `)

    console.log(response)
  }

  render() {
    const { value } = this.state
    return (
      <Container>
        <Input
          value={value}
          placeholder="Message"
          onChangeText={this.onChangeText}
        />
        <Button title="Send" onPress={this.onPressSend} />
      </Container>
    )
  }
}

export default ChatInputArea

const Container = styled.View`
  min-height: 60px;
  flex-direction: row;
`
