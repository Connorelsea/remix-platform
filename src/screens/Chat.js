import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import User from "../ducks/user"
import AppScrollContainer from "../components/AppScrollContainer"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import { bind } from "decko"
import { View } from "react-native"

import { ScrollView, Platform } from "react-native"

import ChatInputArea from "../components/ChatInputArea"
import { mutate } from "../utilities/gql_util"
import Message from "../components/Message"

import { withRouter } from "react-router"

import Header from "../components/Header"
import { TransitionMotion, spring } from "react-motion"

class Chat extends Component {
  renderMessage(msg) {
    return <Text>{JSON.stringify(msg)}</Text>
  }

  keyExtractor(msg) {
    return msg.id
  }

  @bind
  async updateReadPosition() {
    const { messages } = this.props
    const response = await mutate(`
      mutation updateReadPosition {
        updateReadPosition(
          forMessageId: ${messages[0].id}
        ) {
          id
        }
      }
    `)

    console.log(response)
  }

  componentDidMount() {
    this.updateReadPosition()
    this.scrollView.scrollToEnd()
  }

  @bind
  scrollToEnd() {
    this.scrollView.scrollToEnd({ animated: true })
    // this.scrollView.scrollTop = this.scrollView.scrollHeight
    // TODO: Fix this scroll bullshit
    this.endComp.scrollIntoView({ block: "end", inline: "nearest" })
  }

  render() {
    const { messages, foundChat, match, currentUser } = this.props
    const { params: { group, chat } } = match

    let comp = this

    return (
      <OuterContainer>
        <Header user={currentUser} backText="Back" title={`#${chat}`} light />
        <ScrollView
          ref={view => (this.scrollView = view)}
          contentContainerStyle={{ alignItems: "flex-start", padding: 25 }}
        >
          <TransitionMotion
            willLeave={style => ({
              // height: spring(0),
              opacity: spring(0),
            })}
            willEnter={style => ({
              // height: 0,
              opacity: 0,
            })}
            styles={messages.map(msg => ({
              key: msg.id,
              style: { opacity: spring(1) },
              data: { ...msg },
            }))}
          >
            {interpolatedStyles => (
              <View style={{ flex: 1, width: "100%" }}>
                {interpolatedStyles.map((config, i) => (
                  <Message
                    key={config.key}
                    style={config.style}
                    content={config.data.content}
                    user={config.data.user}
                    prev={i < 1 ? {} : interpolatedStyles[i - 1].data}
                    currentUser={currentUser}
                    ref={
                      interpolatedStyles.length === i - 1 &&
                      (c => {
                        comp = c
                      })
                    }
                  />
                ))}
              </View>
            )}
          </TransitionMotion>
        </ScrollView>
        <ChatInputArea chatId={foundChat.id} scrollToEnd={this.scrollToEnd} />
      </OuterContainer>
    )
  }
}

const OuterContainer = styled.View`
  flex: 1;
  ${Platform.OS !== "ios" && "min-height: 100vh"};
`

const Container = styled.ScrollView`
  flex: 1;
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
  const foundGroup = state.user.groups.find(g => g.id === group)
  const foundChat = foundGroup && foundGroup.chats.find(c => c.name === chat)

  if (foundGroup === undefined) {
    // TODO: foundGroup === undefined
    // The group they are trying to access isnt in the store
  }

  // associate the users from the redux store with the messages
  // in this chat

  let messages = state.user.messages
    .filter(msg => msg.chatId === foundChat.id)
    .map(msg => {
      return {
        ...msg,
        user: state.user.users.find(u => u.id === msg.userId),
      }
    })

  return {
    foundChat,
    foundGroup,
    messages,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat))
