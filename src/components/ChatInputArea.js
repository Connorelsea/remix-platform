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
  async onPressSend() {
    const { value } = this.state
    const { chatId, scrollToEnd } = this.props

    this.setState({
      value: "",
    })

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

    console.log("THIS THIS THIS", this)

    setTimeout(scrollToEnd, 100)
    // this.textInput.focus()
  }

  componentDidMount() {
    // this.textInput.focus()
  }

  @bind
  inputRef(comp) {
    console.log("CALLING INPUT REF CALLBACK WITH ", comp)
    this.refs.textInput = comp
  }

  render() {
    const { value } = this.state
    return (
      <Container>
        <Input
          value={value}
          placeholder="Message"
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onPressSend}
          innerRef={this.inputRef}
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
