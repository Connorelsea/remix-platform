import React from "react";
import Message from "./Message";
import styled from "styled-components/native";
import Spacing from "./Spacing";

class MessageList extends React.Component {
  render() {
    const { messages, currentUser } = this.props;
    return (
      <Container id="messageList">
        <Spacing size={130} />
        {messages.map((msg, index) => (
          <Message
            key={msg.id}
            id={msg.id}
            style={msg.style}
            content={msg.content}
            user={msg.user}
            prev={index === 0 ? {} : messages[index - 1]}
            currentUser={currentUser}
            readPositions={msg.readPositions}
          />
        ))}
        <Spacing size={70} />
        <Spacing size={10} name="messageListEnd" />
      </Container>
    );
  }
}

export default MessageList;

const Container = styled.View`
  flex: 1;
  overflow: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
`;
