import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import styles from "../utilities/styles"
import User from "../ducks/user"
import AppScrollContainer from "../components/AppScrollContainer"
import Text, { EditableText } from "../components/Text"
import Spacing from "../components/Spacing"
import { bind } from "decko"
import Button from "../components/Button"
import Input from "../components/Input"
import { mutate } from "../utilities/gql_util"

class Group extends Component {
  state = {
    addingChat: false,
    containsWhitespace: false,
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
        addingChat: false,
      })
    } else {
      this.setState({
        addingChat: true,
      })
    }
  }

  @bind
  onChangeText(text) {
    this.setState({
      containsWhitespace: text.includes(" "),
      chatNameText: text,
    })
  }

  @bind
  onChangeDescription(text) {
    this.setState({ chatDescriptionText: text })
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
          name
          description
        }
      }`,
      { name, description, inGroupId: this.props.group.id }
    )

    console.log(req)

    this.props.addChat(req.data.createChat, this.props.group.id)

    this.setState({
      addingChat: false,
      chatNameText: undefined,
    })
  }

  render() {
    const { group } = this.props
    const { addingChat, containsWhitespace } = this.state
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
        <ActionContainer>
          <Text tier="subtitle">Chats</Text>
          <Spacing size={10} />
          <Button small title="Edit" />
        </ActionContainer>
        <Spacing size={15} />

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
            <Text tier="subtitle">New Chat</Text>,
            <Spacing size={10} />,
            <FakeChatContainer>
              <EditableText
                tier="requestTitle"
                originalText="name"
                onTextChange={this.onChangeText}
              />
              <Spacing size={5} />
              <EditableText
                tier="requestSubtitle"
                originalText="description"
                onTextChange={this.onChangeDescription}
              />
            </FakeChatContainer>,
            containsWhitespace
              ? [
                  <Spacing size={5} />,
                  <Text tier="labelerror">
                    Chat name cannot contain whitespace
                  </Text>,
                ]
              : undefined,
            <Spacing size={10} />,
            <ActionContainer>
              <Button title="Cancel" onPress={this.pressAddChat} />
              <Spacing size={10} />
              <Button
                title="Create"
                onPress={this.createChat}
                disabled={containsWhitespace}
              />
            </ActionContainer>,
          ]
        ) : (
          <ActionContainer>
            <Button title="Add Chat" onPress={this.pressAddChat} />
          </ActionContainer>
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
    addChat: (chat, groupId) => dispatch(User.creators.addChat(chat, groupId)),
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

const Chat = ({ name, description, onChatPress }) => (
  <ChatContainer onPress={onChatPress}>
    <Text tier="requestTitle">#{name}</Text>
    <Spacing size={5} />
    <Text tier="requestSubtitle">{description}</Text>
  </ChatContainer>
)

const ChatContainer = styled.TouchableOpacity`
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px 20px;
  align-items: flex-start;
`

const FakeChatContainer = styled.View`
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px 20px;
  align-items: flex-start;
`

const ChatList = styled.View``

const ActionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`
