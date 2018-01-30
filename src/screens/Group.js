import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import User from "../ducks/user"
import AppScrollContainer from "../components/AppScrollContainer"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import { bind } from "decko"
import Button from "../components/Button"
import Input from "../components/Input"

class Group extends Component {
  state = {
    addingChat: false,
  }

  @bind
  getOnChatPress(name) {
    const { match: { params: { group } }, history } = this.props
    return () => history.push(`/+${group}/${name}`)
  }

  @bind
  pressAddChat() {
    const { addingChat } = this.state

    if (addingChat) {
    } else {
      this.setState({
        addingChat: true,
      })
    }
  }

  render() {
    const { group } = this.props
    const { addingChat } = this.state
    const { name, chats, description } = group

    return (
      <AppScrollContainer title={name}>
        <Text tier="subtitle">Description</Text>
        <Spacing size={5} />
        <Text tier="body">{description}</Text>
        <Spacing size={15} />
        <Text tier="subtitle">Top Recent Messages</Text>
        <Spacing size={5} />
        <Text tier="body">Test</Text>
        <Spacing size={15} />
        <Text tier="subtitle">Chats</Text>
        <Spacing size={5} />
        <ChatList>
          {chats.map(chat => (
            <Chat
              {...chat}
              key={chat.id}
              onChatPress={this.getOnChatPress(chat.name)}
            />
          ))}
        </ChatList>
        {addingChat ? (
          [<Input placeholder="Chat Name" key="chat_name" />]
        ) : (
          <Button title="Add Chat" onPress={this.pressAddChat} />
        )}
      </AppScrollContainer>
    )
  }
}

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
  const { match: { params: { group } } } = props

  console.log(props.match.params)

  return {
    group: state.user.groups.find(g => g.id === group),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Group)

const Chat = ({ name, onChatPress }) => (
  <ChatContainer onPress={onChatPress}>
    <Text tier="body">{name}</Text>
  </ChatContainer>
)

const ChatContainer = styled.TouchableOpacity`
  background-color: ${styles.colors.grey[200]};
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 10px;
`

const ChatList = styled.View`
  align-items: flex-start;
`
