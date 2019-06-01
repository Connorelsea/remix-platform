import React, { Component, Fragment, type Node } from "react";
import { connect } from "react-redux";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import styled, { withTheme } from "styled-components";
import animateScrollTo from "animated-scroll-to";
import scrollToElement from "scroll-to-element";

import { type Message as MessageType } from "../../types/message";
import { type Chat as ChatType } from "../../types/message";
import { getChatMessages } from "../../ducks/messages";
import Box from "../../elements/Box";

import Header from "../../components/Header";
import KeyboardSpacer from "../../components/KeyboardSpacer";
import ChatInputArea from "../../components/ChatInputArea";
import MessageList from "../../components/MessageList";
import ScrollContainer from "../../elements/ScrollContainer";
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
  componentDidUpdate() {
    console.log("DID UPDATE", document.querySelector(".last"));
    document.querySelector(".last").scrollIntoView();
    // animateScrollTo(document.querySelector(".last"));
    // scrollToElement(".last");
  }

  render(): Node {
    const { messages, chat, currentUserId, theme } = this.props;

    if (messages === undefined || messages.length === 0)
      return <div>No messages</div>;

    return (
      <ReflexContainer orientation="horizontal">
        <ReflexElement>
          <Scroller>
            <Spacing size={20} />
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
            <div className="last" />
            <Spacing size={20} />
          </Scroller>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement minSize="75" maxSize="200">
          <ChatInput chat={chat} />
        </ReflexElement>
      </ReflexContainer>
    );
  }
}

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

function mapStateToProps(state, props) {
  console.log("PROPS", props);

  return {
    messages: getChatMessages(state, props.chat.id),
    currentUserId: CurrentDeviceSelector(state).user.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Chat));
