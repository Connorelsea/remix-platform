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
      small,
    } = this.props
    const textColor = fontColorContrast(color) // === "#000000" ? "#FFFFFF" : "#000000"

    let sameUserAsPrev = prev.user && prev.user.id === id
    let isCurrentUser = currentUser.id === id ? 1 : 0
    const space = <Spacing size={6} />

    return (
      <Container iscurrentuser={isCurrentUser} opacity={style.opacity}>
        {!sameUserAsPrev && [<Text tier="messageName">{name}</Text>, space]}
        <Bubble color={color} small={small}>
          <Text tier="body" color={textColor} small={small}>
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
  align-self: ${({ iscurrentuser }) =>
    iscurrentuser ? "flex-end" : "flex-start"};
  align-items: ${({ iscurrentuser }) =>
    iscurrentuser ? "flex-end" : "flex-start"};
  opacity: ${props => props.opacity};
`

const Bubble = styled.View`
  padding: 9px 13px;
  border-radius: 20px;
  background-color: ${({ color }) => color || styles.colors.grey[200]};
  max-width: ${props => (props.small ? 200 : 300)}px;
  ::selection {
    background: ${({ color }) => color || styles.colors.grey[200]};
  }
  transition: all 0.4s;
`
