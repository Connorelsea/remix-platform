import React, { Component } from "react"
import { withRouter } from "react-router"
import styled from "styled-components/native"
import Text from "../components/Text"
import { bind } from "decko"
import { TouchableOpacity } from "react-native"
import styles from "../utilities/styles"
import Card from "../components/Card"
import Spacing from "./Spacing"
import { connect } from "react-redux"
import User from "../ducks/user"
import Message from "./Message"
import Gradient from "./Gradient"

class GroupCard extends Component {
  @bind
  onPress() {
    const { id } = this.props.group
    this.props.history.push(`/+${id}`)
  }

  render() {
    const {
      id,
      iconUrl,
      name,
      description,
      isDirectMessage,
      members,
    } = this.props.group
    const { user, messages, users } = this.props

    let title = name
    let icon = iconUrl

    if (isDirectMessage) {
      console.log(isDirectMessage)
      console.log(members)

      const otherUser = members.find(member => member.id !== user.id)
      const otherUserFound = users.find(u => u.id === otherUser.id) || {}
      title = otherUserFound.name
      console.log("FOUND OTHERUSER", otherUserFound)
      icon = otherUserFound.iconUrl
    }

    return (
      <TouchableOpacity onPress={this.onPress} style={{ marginBottom: 25 }}>
        <Card>
          <Container>
            <Image
              source={{
                uri: icon || "https://www.arete.net/Content/Images/nopic.jpg",
              }}
            />
            <Spacing size={15} />
            <Body>
              <Gradient
                colors={[" rgba(0,0,0,0)", "#FFFFFF"]}
                size={90}
                style={{
                  position: "absolute",
                  bottom: 0,
                  // border: "1px solid black",
                  zIndex: 9999,
                }}
              />
              <Text tier="title">{title}</Text>
              <Spacing size={10} />
              <MessageContainer>
                {messages
                  .slice(-3)
                  .reverse()
                  .map((msg, i) => (
                    <Message
                      key={msg.id}
                      prev={msg}
                      currentUser={user}
                      style={{ opacity: 1 }}
                      small={1}
                      {...msg}
                    />
                  ))}
              </MessageContainer>
            </Body>
          </Container>
        </Card>
      </TouchableOpacity>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToFriendRequests: id => {
      dispatch(User.creators.subscribeToFriendRequests(id))
    },
    subscribeToMessages: id => {
      dispatch(User.creators.subscribeToMessages(id))
    },
    loadInitialUser: id => dispatch(User.creators.loadInitialUser(id)),
    removeFriendRequest: id => dispatch(User.creators.removeFriendRequest(id)),
  }
}

function mapStateToProps(state, props) {
  return {
    user: state.user,
    friendRequests: state.user.friendRequests,
    users: state.user.users,
    messages: User.selectors.getGroupMessages(state, props.group.id),
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GroupCard)
)

const imageSize = 110

const Image = styled.Image`
  height: ${imageSize}px;
  width: ${imageSize}px;
  border-radius: ${imageSize / 2};
  background-color: ${styles.colors.grey[100]};
  overflow: hidden;
`

const Container = styled.View`
  flex-direction: row;
`

const MessageContainer = styled.View`
  align-items: center;
  width: 95%;
`

const Body = styled.View`
  flex: 1;
`
