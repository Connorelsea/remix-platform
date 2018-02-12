import React, { Component } from "react"
import { connect } from "react-redux"
import { bind } from "decko"
import styled from "styled-components/native"
import { mutate } from "../utilities/gql_util"
import Text from "../components/Text"
import ChatInputArea from "../components/ChatInputArea"
import Message from "../components/Message"
import User from "../ducks/user"
import { withRouter } from "react-router"
import Header from "../components/Header"
import { TransitionMotion, spring } from "react-motion"

import {
  ScrollView,
  Platform,
  View,
  KeyboardAvoidingView,
  FlatList,
} from "react-native"
import CustomKeyboardAwareView from "../components/CustomKeyboardAwareView"
import { KeyboardTrackingView } from "react-native-keyboard-tracking-view"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import KeyboardSpacer from "react-native-keyboard-spacer"

import { InvertibleFlatList } from "react-native-invertible-flatlist"
import { BlurView, VibrancyView } from "react-native-blur"

class Chat extends React.Component {
  renderMessage(msg) {
    return <Text>{JSON.stringify(msg)}</Text>
  }

  keyExtractor(msg) {
    return msg.id
  }

  @bind
  async updateReadPosition() {
    const { messages } = this.props
    if (messages.length < 1) return
    const response = await mutate(`
      mutation updateReadPosition {
        updateReadPosition(
          forMessageId: ${messages[messages.length - 1].id}
        ) {
          id
        }
      }
    `)

    console.log("[READ POSITION] Updated read position")
    console.log(response)
  }

  componentDidMount() {
    console.log("MOUNTING CHAT")
    this.updateReadPosition()
    this.scrollView.scrollToEnd()
    this.updateFocus()
  }

  @bind
  updateFocus() {
    console.log("updating focus to textbox")
    this.textInput.focus()
  }

  @bind
  scrollToEnd() {
    this.scrollView.scrollToEnd()
    // this.scrollView.scrollTop = this.scrollView.scrollHeight
    // TODO: Fix this scroll bullshit
    // this.endComp.scrollIntoView({ block: "end", inline: "nearest" })
  }

  state = {
    selectedMessages: [],
  }

  @bind
  addSelectedMessage(id) {
    const { messages } = this.props
    const { selectedMessages } = this.state
    const message = messages.find(msg => msg.id === id)

    this.setState(state => ({
      selectedMessages: [...selectedMessages, message],
    }))
  }

  removeSelectedMessage(id) {
    // TODO
  }

  clearSelectedMessages() {
    this.setState({ selectedMessages: [] })
  }

  render() {
    const { messages, foundChat, match, currentUser } = this.props
    const { params: { chat } } = match
    const { selectedMessages } = this.state

    const flippedMessages = messages.reverse()
    console.log("FLIPPED MESAGES")
    console.log(flippedMessages)

    return (
      <OuterContainer onFocus={this.updateReadPosition}>
        <Header user={currentUser} backText="Back" title={`#${chat}`} light />
        <View style={{ flex: 1 }}>
          <ScrollView
            className="chatScroll"
            ref={view => {
              this.scrollView = view
            }}
            contentContainerStyle={{
              flex: 1,
              marginTop: 115,
              position: "relative",
              paddingBottom: 70,
            }}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
          >
            {/* TODO: Seperate list rendering entirely on web. Too complicated to abstract*/}
            <FlatList
              inverted
              keyExtractor={item => item.id}
              data={flippedMessages}
              renderItem={({ item, index }) => (
                <Message
                  id={item.id}
                  style={item.style}
                  content={item.content}
                  user={item.user}
                  prev={
                    index >= flippedMessages.length - 1
                      ? {}
                      : flippedMessages[index + 1]
                  }
                  currentUser={currentUser}
                  readPositions={item.readPositions}
                  addSelectedMessage={this.addSelectedMessage}
                  isSelected={
                    console.log(item) &&
                    selectedMessages.find(sm => sm.id === msg.id) !== undefined
                  }
                />
              )}
            />
          </ScrollView>
          <ChatInputArea
            innerRef={input => {
              this.textInput = input
            }}
            chatId={foundChat.id}
            scrollToEnd={this.scrollToEnd}
            updateFocus={this.updateFocus}
          />
        </View>
        <KeyboardSpacer />
      </OuterContainer>
    )
  }
}

const OuterContainer = styled.View`
  flex: 1;
  ${Platform.OS !== "ios" && "min-height: 100vh"};
`

function mapDispatchToProps(dispatch) {
  return {
    subscribeToFriendRequests: id => {
      dispatch(User.creators.subscribeToFriendRequests(id))
    },
    loadInitialUser: id => dispatch(User.creators.loadInitialUser(id)),
    removeFriendRequest: id => dispatch(User.creators.removeFriendRequest(id)),
  }
}

function mapStateToProps(state, props) {
  const { match: { params: { group, chat } } } = props
  const foundChat = User.selectors.getChat(state, group, chat)

  return {
    foundChat,
    currentUser: state.user,
    messages: User.selectors.getChatMessages(state, group, foundChat.id),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat))
