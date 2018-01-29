import React, { Component } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import fontColorContrast from "font-color-contrast"

class Message extends Component {
  render() {
    const {
      content: { type, data },
      user: { id, name, color },
      prev,
      style,
      currentUser,
    } = this.props
    const textColor = fontColorContrast(color) // === "#000000" ? "#FFFFFF" : "#000000"

    let sameUserAsPrev = prev.user && prev.user.id === id
    let isCurrentUser = currentUser.id === id
    const space = <Spacing size={6} />

    return (
      <Container isCurrentUser={isCurrentUser} opacity={style.opacity}>
        {!sameUserAsPrev && [<Text tier="messageName">{name}</Text>, space]}
        <Bubble color={color}>
          <Text tier="body" color={textColor}>
            {data.text}
          </Text>
        </Bubble>
        {space}
      </Container>
    )
  }
}

export default Message

const Container = styled.View`
  align-self: ${({ isCurrentUser }) =>
    isCurrentUser ? "flex-end" : "flex-start"};
  align-items: ${({ isCurrentUser }) =>
    isCurrentUser ? "flex-end" : "flex-start"};
  opacity: ${props => props.opacity};
`

const Bubble = styled.View`
  padding: 10px 12px;
  border-radius: 20px;
  background-color: ${({ color }) => color || styles.colors.grey[200]};
  max-width: 300px;
  transition: background-color 0.6s;
`
