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
import { mutate } from "../utilities/gql_util"

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
      this.setState({
        addingChat: false
      })
    } else {
      this.setState({
        addingChat: true,
      })
    }
  }

  @bind
  onChangeText(text) {
    this.setState({ chatNameText: text })
  }

  @bind
  async createChat() {
    const { chatNameText, chatDescriptionText } = this.state
    let name = chatNameText
    let description = chatDescriptionText
    console.log("Creating chat with " + name)

    const req = await mutate(
      `mutation($name: String!, $description: String, $inGroupId: ID!) {
        createChat(
          name: $name
          description: $description
          inGroupId: $inGroupId
        ) {
          id
        }
      }`,
      { name, description, inGroupId: this.props.group.id }
    )

    this.setState({
      addingChat: false,
      chatNameText: undefined,
    })
  }

  render() {
    const { group } = this.props
    const { addingChat } = this.state
    let {
      id,
      iconUrl,
      name,
      description,
      isDirectMessage,
      members,
      chats,
    } = this.props.group
    const { user, users } = this.props

    if (isDirectMessage) {
      const otherUser = members.find(member => member.id !== user.id)
      const otherUserFound = users.find(u => u.id === otherUser.id) || {}
      name = otherUserFound.name
    }

    return (
      <AppScrollContainer title={name}>
        <Text tier="subtitle">Chats</Text>
        <Spacing size={10} />

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
          [
            <Input
              placeholder="Chat Name"
              key="chat_name"
              onChangeText={this.onChangeText}
            />,
            <Spacing size={10} />,
            <ActionContainer>
              <Button title="Cancel" onPress={this.pressAddChat} />
              <Spacing size={10} />
              <Button title="Create" onPress={this.createChat} />
            </ActionContainer>,
          ]
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
    user: state.user,
    users: state.user.users,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Group)

const Chat = ({ name, onChatPress }) => (
  <ChatContainer onPress={onChatPress}>
    <Text tier="body">{name}</Text>
  </ChatContainer>
)

const ChatContainer = styled.TouchableOpacity`
  background-color: white;
  border-radius: 50px;
  margin-bottom: 15px;
  padding: 15px 20px;
`

const ChatList = styled.View``

const ActionContainer = styled.View`
  flex-direction: row;
`
