import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { type Message as MessageType } from "../../types/message";
import { type Chat as ChatType } from "../../types/message";
import { getChatMessages } from "../../ducks/messages";
import Box from "../../elements/Box";

import Header from "../../components/Header";
import { View } from "react-native";
import KeyboardSpacer from "../../components/KeyboardSpacer";
import ChatInputArea from "../../components/ChatInputArea";
import MessageList from "../../components/MessageList";
import ScrollContainer from "../../elements/ScrollContainer";
import styled, { withTheme } from "styled-components";
import Spacing from "../../components/Spacing";
import ProvideUsers from "../../providers/ProvideUsers";
import Message from "../../components/Message/index";
import ChatInput from "../../components/ChatInput";
import Paragraph from "../../elements/Paragraph";
import { CurrentDeviceSelector } from "../../ducks/auth";
import { bind } from "decko";
import { type Theme } from "../../utilities/theme";

type Props = {
  chat: ChatType,
  messages: Array<MessageType>,
  currentUserId: string,
  theme: Theme,
};

type State = {};

class Chat extends Component<Props, State> {
  @bind
  scrollToBottom() {
    if (this.scrollContainer === undefined) return;
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(): Node {
    const { messages, chat, currentUserId, theme } = this.props;

    if (messages === undefined || messages.length === 0)
      return <div>No messages</div>;

    return (
      <OuterContainer>
        <ScrollContainer innerRef={e => (this.scrollContainer = e)}>
          <ContentContainer
            backgroundColor={theme.appColors.chat_background_color}
          >
            <ProvideUsers
              userIds={messages.map(m => m.userId)}
              render={(props: ProvideUsersRenderProps) => {
                const { users, usersLoading } = props;

                if (messages === undefined || messages.length === 0)
                  return <div>No messages</div>;

                if (usersLoading) return <div>Users loading</div>;

                if (!users) return <div>Users undefined</div>;

                return messages.map((m, i) => (
                  <Message
                    key={m.id}
                    message={m}
                    previousMessage={i === 0 ? {} : messages[i - 1]}
                    user={users.find(u => u.id === m.userId)}
                    currentUserId={currentUserId}
                  />
                ));
              }}
            />
            <Spacing size={80} />;
          </ContentContainer>
        </ScrollContainer>

        <ChatInput chat={chat} />
      </OuterContainer>
    );
  }
}

const OuterContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: ${p => p.backgroundColor || p.theme.background.secondary};
  min-height: 100%;
  width: 100%;
`;

function mapStateToProps(state, props) {
  console.log("PROPS", props, props.chat.id);
  return {
    messages: getChatMessages(state, props.chat.id),
    currentUserId: CurrentDeviceSelector(state).user.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Chat));
