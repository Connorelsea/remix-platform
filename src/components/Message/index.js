import React, { Component, type Node } from "react";
import { connect } from "react-redux";

import ProvideUsers, {
  ProvideUsersRenderProps,
} from "../../providers/ProvideUsers";

import { type User } from "../../types/user";
import { type Message as MessageType } from "../../types/message";

import styled from "styled-components";
import Icon from "../Icon";

import Box from "../../elements/Box";
import Spacing from "../Spacing";

import { prop } from "styled-tools";

type Props = {
  message: MessageType,
  user: User,
  currentUserId: string,
};

type State = {};

class Message extends Component<Props, State> {
  render(): Node {
    const { message, user, currentUserId } = this.props;

    const isCurrentUser = currentUserId === user.id;

    return (
      <MessageContainer isCurrentUser={isCurrentUser}>
        <Box>
          {!isCurrentUser && [
            <Spacing size={10} />,
            <Box>
              <Icon iconUrl={user.iconUrl} iconSize={40} />
              <Spacing size={10} />
            </Box>,
          ]}
          <Box>
            <Bubble backgroundColor={user.color}>
              {message.content.data.text}
            </Bubble>
          </Box>
          {isCurrentUser && <Spacing size={10} />}
        </Box>
      </MessageContainer>
    );
  }
}

export default Message;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${p => (p.isCurrentUser ? "flex-end" : "flex-start")};

  width: 100%;
  padding: 8px 0 0 15px;
`;

const Bubble = styled.div`
  background-color: ${prop("backgroundColor")};
  color: white;
  border-radius: 20px;
  padding: 7px 14px;
  font-size: ${p => p.theme.fontSize.body}px;

  max-width: 380px;

  font-weight: 500;
  letter-spacing: -0.2px;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`;
