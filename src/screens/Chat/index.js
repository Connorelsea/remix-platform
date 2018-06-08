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
import ContentContainer from "../../elements/ContentContainer";
import styled from "styled-components";
import Spacing from "../../components/Spacing";
import ProvideUsers from "../../providers/ProvideUsers";
import Message from "../../components/Message/index";
import ChatInput from "../../components/ChatInput";
import Paragraph from "../../elements/Paragraph";
import { CurrentDeviceSelector } from "../../ducks/auth";
import { bind } from "decko";

type Props = {
  chat: ChatType,
  messages: Array<MessageType>,
  currentUserId: string,
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
    const { messages, chat, currentUserId } = this.props;

    if (messages === undefined || messages.length === 0)
      return <div>No messages</div>;

    return (
      <OuterContainer>
        <ScrollContainer innerRef={e => (this.scrollContainer = e)}>
          <ContentContainer>
            <ProvideUsers
              userIds={messages.map(m => m.userId)}
              render={(props: ProvideUsersRenderProps) => {
                const { users, usersLoading } = props;

                console.log("MESSAGESSSSSSSS IN PROVIDE", messages);

                console.log("USERS IN PROVIDE", users, usersLoading);

                if (messages === undefined || messages.length === 0)
                  return <div>No messages</div>;

                if (usersLoading) return <div>Users loading</div>;

                if (!users) return <div>Users undefined</div>;

                return messages.map(m => (
                  <Message
                    message={m}
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
