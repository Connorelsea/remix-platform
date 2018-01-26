import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import User from "../ducks/user"
import AppScrollContainer from "../components/AppScrollContainer"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import { bind } from "decko"

import { List, AutoSizer, CellMeasurer } from "react-virtualized"

class Chat extends Component {
  renderMessage(msg) {
    return <Text>{JSON.stringify(msg)}</Text>
  }

  keyExtractor(msg) {
    return msg.id
  }

  render() {
    const { messages } = this.props
    return (
      <AppScrollContainer title={"name"}>
        {/* chat header here */}
        <Container />
        {/* chat input here */}
      </AppScrollContainer>
    )
  }
}

const Container = styled.View`
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
    messages: state.user.messages.filter(msg => msg.chatId === foundChat.id),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
