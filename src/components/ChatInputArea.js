import React, { Component } from "react";
import styled from "styled-components/native";
import styles from "../utilities/styles";
import Spacing from "../components/Spacing";
import { bind } from "decko";

import Input from "./Input";
import { mutate } from "../utilities/gql_util";
import { View } from "react-native";
import VibrancyView from "./VibrancyView";
import Text from "./Text";

class ChatInputArea extends Component {
  state = {
    value: "",
  };

  @bind
  onChangeText(value) {
    this.setState({ value });
  }

  @bind
  onPressSend() {
    const { value } = this.state;
    const { chatId, scrollToBottom, updateFocus } = this.props;

    this.setState({
      value: "",
    });

    console.log("BEFORE SEND");

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
      console.log("SCROLLING TO BOTTOM");
      scrollToBottom();
      updateFocus();
    });
  }

  render() {
    const { value } = this.state;
    const { innerRef } = this.props;

    return [
      <VibrancyView
        blurType="light"
        blurAmount={40}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 65,
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
          background: "transparent",
        }}
      >
        <ChatInput
          value={value}
          placeholder="Message"
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onPressSend}
          innerRef={innerRef}
        />
        <Spacing size={10} />
        <Button onPress={this.onPressSend}>
          <Text tier="body">Send</Text>
        </Button>
      </View>,
    ];
  }
}

export default ChatInputArea;

const ChatInput = styled.TextInput`
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 100px;
  margin: 0px;
  padding: 6px 15px;
  font-size: 16px;
  flex: 1;
  -webkit-backdrop-filter: blur(60px);
  background-color: rgba(255, 255, 255, 0.7);
  outline: none;
`;

const Button = styled.TouchableOpacity`
  padding: 14px 15px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  -webkit-backdrop-filter: blur(60px);
  background-color: rgba(255, 255, 255, 0.8);
`;
