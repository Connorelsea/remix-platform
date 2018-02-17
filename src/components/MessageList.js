import React from "react"
import { FlatList } from "react-native"
import Message from "./Message"

class MessageList extends React.Component {
  renderMessage(messages) {
    return ({ item, index }) => {
      const { currentUser } = this.props
      return (
        <Message
          id={item.id}
          style={item.style}
          content={item.content}
          user={item.user}
          prev={index >= messages.length - 1 ? {} : messages[index + 1]}
          currentUser={currentUser}
          readPositions={item.readPositions}
        />
      )
    }
  }

  render() {
    const { messages } = this.props
    // const { params: { chat } } = match

    const flippedMessages = messages.reverse()

    return (
      <ScrollView
        className="chatScroll"
        ref={view => {
          this.scrollView = view
        }}
        contentContainerStyle={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
        }}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
      >
        <FlatList
          inverted
          keyExtractor={item => item.id}
          data={flippedMessages}
          renderItem={this.renderMessage(flippedMessages)}
        />
      </ScrollView>
    )
  }
}

export default MessageList
