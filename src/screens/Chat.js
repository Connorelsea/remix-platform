import React from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import styled from "styled-components";
import { mutate } from "../utilities/gql_util";
import ChatInputArea from "../components/ChatInputArea";
import User from "../ducks/user";
import { withRouter } from "react-router";
import Header from "../components/Header";

import { Platform, View } from "react-native";
import KeyboardSpacer from "../components/KeyboardSpacer";
import MessageList from "../components/MessageList";

import { Events, scroller, scrollSpy } from "react-scroll";

class Chat extends React.Component {
  componentDidMount() {
    console.log("MOUNTING CHAT");
    this.updateReadPosition();
    this.updateFocus();

    Events.scrollEvent.register("begin", function(to, element) {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register("end", function(to, element) {
      console.log("end", arguments);
    });

    scrollSpy.update();

    // this.scrollToBottom()
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    this.scrollToBottom();

    if (props.messages.length !== nextProps.messages.length) {
      // SCROLL TO BOTTOM WHEN LENGTH CHANGES
      // CONDITIONS HERE TO STOP SCROLL, LIKE IF USER IS NOT CURRENTLY SCROLLING AT THE BOTTOM
      this.scrollToBottom();
    }

    // UPDATE SCROLL IF READ POSITION CHANGED
  }

  @bind
  scrollToBottom() {
    scroller.scrollTo("messageListEnd", {
      duration: 1100,
      // delay: 100,
      smooth: true,
      containerId: "messageList",
    });
  }

  keyExtractor(msg) {
    return msg.id;
  }

  @bind
  async updateReadPosition() {
    const { messages } = this.props;
    if (messages.length < 1) return;
    const response = await mutate(`
      mutation updateReadPosition {
        updateReadPosition(
          forMessageId: ${messages[messages.length - 1].id}
        ) {
          id
        }
      }
    `);

    console.log("[READ POSITION] Updated read position");
    console.log(response);
  }

  @bind
  updateFocus() {
    console.log("updating focus to textbox");
    this.textInput.focus();
  }

  render() {
    const { messages, foundChat, match, currentUser } = this.props;
    const { params: { chat } } = match;

    return (
      <OuterContainer onFocus={this.updateReadPosition}>
        <Header user={currentUser} backText="Back" title={`#${chat}`} light />
        <View style={{ flex: 1 }}>
          <MessageList messages={messages} currentUser={currentUser} />
          <ChatInputArea
            innerRef={input => {
              this.textInput = input;
            }}
            chatId={foundChat.id}
            scrollToBottom={this.scrollToBottom}
            updateFocus={this.updateFocus}
          />
        </View>
        <KeyboardSpacer />
      </OuterContainer>
    );
  }
}

const OuterContainer = styled.View`
  flex: 1;
  ${Platform.OS !== "ios" && "min-height: 100vh"};
`;

function mapDispatchToProps(dispatch) {
  return {
    subscribeToFriendRequests: id => {
      dispatch(User.creators.subscribeToFriendRequests(id));
    },
    loadInitialUser: id => dispatch(User.creators.loadInitialUser(id)),
    removeFriendRequest: id => dispatch(User.creators.removeFriendRequest(id)),
  };
}

function mapStateToProps(state, props) {
  const { match: { params: { group, chat } } } = props;
  const foundChat = User.selectors.getChat(state, group, chat);

  return {
    foundChat,
    currentUser: state.user,
    messages: User.selectors.getChatMessages(state, group, foundChat.id),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
