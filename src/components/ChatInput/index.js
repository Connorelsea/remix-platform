import React, { Component, type Node } from "react";
import styled from "styled-components";
import TextInput from "../../elements/TextInput";
import Box from "../../elements/Box.web";
import Button from "../../elements/Button";
import Spacing from "../Spacing";
import { bind } from "decko";
import { mutate } from "../../utilities/gql_util";
import { connect } from "react-redux";

import { type Chat } from "../../types/chat";
import { ApolloClient } from "apollo-client";

import tinycolor from "tinycolor2";

type Props = {
  apolloClient: ApolloClient,
  chat: Chat,
};

type State = {
  input: string,
};

class ChatInput extends Component<Props, State> {
  state = {
    input: "",
  };

  @bind
  onChange(event) {
    const input = event.target.value;
    this.setState({
      input,
    });
  }

  @bind
  onPressSend() {
    const { input } = this.state;
    const { chat, apolloClient } = this.props;

    this.setState({
      input: "",
    });

    console.log("BEFORE SEND");

    mutate(
      `
      mutation createMessage {
        createMessage(
          type: "remix/text",
          data: { text: "${input}" },
          chatId: ${chat.id},
        ) {
          id
        }
      }
    `,
      {},
      apolloClient
    ).then(() => {
      console.log("SENT MESSAGE");
      // scrollToBottom();
      // updateFocus();
    });
  }

  render(): Node {
    return (
      <InputContainer>
        <TextInput
          value={this.state.input}
          placeholder="Message"
          secure
          onChange={this.onChange}
        />
        <Spacing size={10} />
        <Button title="Send" onClick={this.onPressSend} />
      </InputContainer>
    );
  }
}

const InputContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
  background-color: ${p =>
    tinycolor(p.theme.background.secondary)
      .setAlpha(0.7)
      .toString()};

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  display: flex;
  flex-direction: row;
`;

function mapStateToProps(state) {
  return {
    apolloClient: state.auth.apolloClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
