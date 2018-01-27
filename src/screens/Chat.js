import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import User from "../ducks/user"
import AppScrollContainer from "../components/AppScrollContainer"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import { bind } from "decko"

import { ScrollView, Platform } from "react-native"

import { List, AutoSizer, CellMeasurer } from "react-virtualized"

import ChatInputArea from "../components/ChatInputArea"
import { mutate } from "../utilities/gql_util"

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
  }

  render() {
    const { messages, foundChat, match } = this.props
    const { params: { group, chat } } = match

    return (
      <OuterContainer>
        <ScrollView>
          {messages.map(msg => <Text tier="body">{JSON.stringify(msg)}</Text>)}
        </ScrollView>
        <ChatInputArea chatId={foundChat.id} />
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

  return {
    foundChat,
    foundGroup,
    messages: state.user.messages.filter(msg => msg.chatId === foundChat.id),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
