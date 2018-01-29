import React, { Component } from "react"
import { connect } from "react-redux"
import { ScrollView, Platform, View } from "react-native"
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
    if (messages.length < 1) return
    const response = await mutate(`
      mutation updateReadPosition {
        updateReadPosition(
          forMessageId: ${messages[0].id}
        ) {
          id
        }
      }
    `)

    console.log("[READ POSITION] Updated read position")
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
    const { messages = [], foundChat, match, currentUser } = this.props
    const { params: { chat } } = match

    let comp = this

    return (
      <OuterContainer>
        <Header user={currentUser} backText="Back" title={`#${chat}`} light />
        <ScrollView
          ref={view => (this.scrollView = view)}
          contentContainerStyle={{
            alignItems: "flex-start",
            padding: 25,
            marginTop: 100,
          }}
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

function newMapStateToProps(state, props) {
  const { match: { params: { group, chat } } } = props
  console.log(User)
  console.log("NEW MAP STATE TO PROPS")
  const foundChat = User.selectors.getChat(state, group, chat)
  console.log("FOUND CHAT ", foundChat)
  return {
    foundChat,
    messages: User.selectors.getChatMessages(state, group, foundChat.id),
  }
}

export default withRouter(connect(newMapStateToProps, mapDispatchToProps)(Chat))
