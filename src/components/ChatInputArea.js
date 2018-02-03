import React, { Component } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
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
  onPressSend() {
    const { value } = this.state
    const { chatId, scrollToEnd, updateFocus } = this.props

    this.setState({
      value: "",
    })

    console.log("BEFORE SEND")

    mutate(`
      mutation createMessage {
        createMessage(
          type: "remix/text",
          data: { text: "${value}" },
          chatId: ${chatId},
        ) {
          id
        }
      }
    `).then(() => {
      console.log("AFTER SEND")
      scrollToEnd()
      updateFocus()
    })
  }

  render() {
    const { value } = this.state
    const { innerRef } = this.props
    return (
      <Container>
        <Input
          value={value}
          placeholder="Message"
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onPressSend}
          innerRef={innerRef}
        />
        <Spacing size={10} />
        <Button title="Send" onPress={this.onPressSend} />
      </Container>
    )
  }
}

export default ChatInputArea

const Container = styled.View`
  min-height: 60px;
  flex-direction: row;
  padding: 10px;
  background-color: ${styles.colors.grey[100]};
  border-top: 1px solid ${styles.colors.grey[200]};
`
