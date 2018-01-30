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
      users,
    } = this.props.group
    const { user, messages } = this.props

    let title = name

    if (isDirectMessage) {
      const firstUser = users.find(u => u.id == users[0].id)
      const secondUser = users.find(u => u.id == users[0].id)
      if (firstUser.id == user.id) title = firstUser.name
      else title = secondUser.name
    }

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card>
          <Container>
            <Image
              source={{
                uri:
                  iconUrl || "https://www.arete.net/Content/Images/nopic.jpg",
              }}
            />
            <Spacing size={15} />
            <Body>
              <Text tier="title">{title}</Text>
              <MessageContainer>
                {messages
                  .slice(-4)
                  .map((msg, i) => (
                    <Message
                      key={msg.id}
                      prev={msg}
                      currentUser={user}
                      {...msg}
                      style={{ opacity: 1 }}
                      small={1}
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

const imageSize = 90

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
`

const Body = styled.View``
