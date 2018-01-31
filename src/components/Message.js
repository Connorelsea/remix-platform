import React, { Component } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import fontColorContrast from "font-color-contrast"
import Icon from "react-native-vector-icons/dist/Feather"

class Message extends Component {
  render() {
    const {
      content: { type, data },
      user: { id, name, color },
      readPositions,
      prev,
      style,
      currentUser,
      small,
    } = this.props
    const textColor = fontColorContrast(color) // === "#000000" ? "#FFFFFF" : "#000000"

    console.log(readPositions)

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
        {readPositions && <Spacing size={6} />}
        {readPositions.map(rp => (
          <ReadPos>
            <Text tier="messageName" color={styles.colors.grey[200]}>
              {rp.user.name}
            </Text>
            <Spacing size={5} />
            <Icon name="eye" size={22} color={rp.user.color} />
          </ReadPos>
        ))}
        {space}
      </Container>
    )
  }
}

export default Message

const ReadPos = styled.View`
  flex-direction: row;
`

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
  max-width: ${props => (props.small ? 200 : 330)}px;
  transition: all 0.4s;
`
