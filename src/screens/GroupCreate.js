import React, { Component } from "react"
import styled from "styled-components"
import AppScrollContainer from "../components/AppScrollContainer"
import { mutate } from "../utilities/gql_util"
import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import Button from "../components/Button"
import Input from "../components/Input"
import { bind } from "decko"
import Icon from "react-native-vector-icons/dist/Feather"
import { TouchableOpacity, Switch } from "react-native"

class GroupCreate extends Component {
  state = {
    groupName: undefined,
    groupDescription: undefined,
    chats: ["general", "news", "music"],
  }

  attemptCreateGroup({ iconUrl, name, description }) {
    mutate(
      `
      mutation createGroup(
        $iconUrl: String,
        $name: String,
        $description: String,
      ) {
        createGroup(
          iconUrl: $iconUrl,
          name: $name,
          description: $description,
        ) {
          id
        }
      }
    `,
      { iconUrl, name, description }
    )
      .then(() => {
        this.props.history.push("/create/done")
      })
      .catch(error => {})
  }

  @bind
  onChatAdd(chat) {
    this.setState({
      chats: [...this.state.chats, this.state.chatText],
      chatText: "",
    })
    // this.chatInput.focus()
  }

  @bind
  onChangeText(chatText) {
    this.setState({
      chatText,
    })
  }

  render() {
    const { user } = this.props
    const { groupName, groupDescription, chats, chatText } = this.state

    return (
      <AppScrollContainer backText="Cancel" user={user} title="Create Group">
        <Container>
          <SubHeader>Group Information</SubHeader>
          <Spacing size={15} />
          <Input
            onChangeText={groupName => this.setState({ groupName })}
            value={groupName}
            placeholder="Group Name"
          />
          <Spacing size={15} />
          <Input
            onChangeText={groupDescription =>
              this.setState({ groupDescription })
            }
            value={groupDescription}
            placeholder="Group Description"
          />
          <Spacing size={15} />
          {/* TODO: Switch public/private component functionality + design */}
          {/* <SwitchComp />
          <Spacing size={15} /> */}
          <SubHeader>Chats</SubHeader>
          <Spacing size={10} />
          <SubHeaderInfo>
            Sub-categories to help organize your group. We've added some default
            ones, but feel free to remove them or add more
          </SubHeaderInfo>
          <Spacing size={15} />
          <ChatList>{chats.map(chat => <Chat name={chat} />)}</ChatList>
          <ChatInput
            chatText={chatText}
            onChatAdd={this.onChatAdd}
            onChangeText={this.onChangeText}
            inputRef={input => (this.chatInput = input)}
          />
          <Spacing size={15} />
          <SubHeader>Members</SubHeader>
          <Spacing size={10} />
          <SubHeaderInfo>
            Choose some friends to invite to your group
          </SubHeaderInfo>
          <Spacing size={15} />
          <Button
            title="Create and Invite"
            icon={<Icon name="users" size={25} />}
          />
        </Container>
      </AppScrollContainer>
    )
  }
}

export default GroupCreate

const Chat = ({ name }) => [
  <ChatContainer>
    <ChatName>{name}</ChatName>
    <Spacing size={10} />
    <TouchableOpacity>
      <Icon name="x" size={25} color={styles.colors.grey[500]} />
    </TouchableOpacity>
  </ChatContainer>,
  <Spacing size={15} />,
]

const ChatInput = ({ onChatAdd, chatText, onChangeText, inputRef }) => (
  <InputContainer>
    <Input onChangeText={onChangeText} value={chatText} ref={inputRef} />
    <Spacing size={10} />
    <Button title="Add" onPress={onChatAdd} />
  </InputContainer>
)

const SwitchComp = ({}) => (
  <SwitchContainer>
    <Switch />
    <Spacing size={10} />
    <Text tier="body">Public Chat</Text>
    <Text tier="body">Currently Private</Text>
  </SwitchContainer>
)

const SwitchContainer = styled.View`
  flex-direction: row;
`

const InputContainer = styled.View`
  flex-direction: row;
`

const ChatList = styled.View`
  align-items: flex-start;
`

const ChatContainer = styled.View`
  background-color: ${styles.colors.grey[200]};
  padding: 10px 15px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ChatName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 2px;
`

const SubHeader = styled.Text`
  font-size: 16px;
  color: ${styles.colors.grey[300]};
  font-weight: 500;
`

const SubHeaderInfo = styled.Text`
  font-size: 16px;
  color: ${styles.colors.grey[500]};
  font-weight: 400;
`

const Container = styled.View`
  flex: 1;
`
