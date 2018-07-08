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
  previousMessage: MessageType,
  user: User,
  currentUserId: string,
};

type State = {};

class Message extends Component<Props, State> {
  render(): Node {
    const { message, previousMessage, user, currentUserId } = this.props;

    const isCurrentUser = currentUserId === user.id;
    const isSameUserAsPrev = message.userId === previousMessage.userId;

    return (
      <MessageContainer isCurrentUser={isCurrentUser}>
        <Box>
          {!isCurrentUser &&
            !isSameUserAsPrev && [
              <Spacing size={10} />,
              <Box>
                <Icon iconUrl={user.iconUrl} iconSize={40} />
                <Spacing size={10} />
              </Box>,
            ]}
          {!isCurrentUser && isSameUserAsPrev && <EmptyIconSpace />}
          <Box alignCenter>
            <Bubble backgroundColor={user.color}>
              {message.content.data.text}
            </Bubble>
          </Box>
          {isCurrentUser && <Spacing size={10} />}
        </Box>
        <Spacing size={5} />
      </MessageContainer>
    );
  }
}

export default Message;

const EmptyIconSpace = styled.div`
  width: 60px;
  height: 40px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${p => (p.isCurrentUser ? "flex-end" : "flex-start")};
  width: 100%;
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
