import React, { Component } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import Spacing from "../components/Spacing"
import { bind } from "decko"

import Input from "./Input"
import Button from "./Button"
import { mutate } from "../utilities/gql_util"
import { BlurView, VibrancyView } from "react-native-blur"
import { View } from "react-native"

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
      scrollToEnd()
      updateFocus()
    })
  }

  render() {
    const { value } = this.state
    const { innerRef } = this.props
    return [
      <VibrancyView
        blurType="light"
        blurAmount={40}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 70,
        }}
        key="vibrancy"
      />,
      <View
        key="input"
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 10,
        }}
      >
        <Input
          value={value}
          placeholder="Message"
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onPressSend}
          innerRef={innerRef}
        />
        <Spacing size={10} />
        <Button title="Send" onPress={this.onPressSend} />
      </View>,
    ]
  }
}

export default ChatInputArea
