import React, { Component } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import fontColorContrast from "font-color-contrast"
import Icon from "react-native-vector-icons/dist/Feather"
import { Motion, spring } from "react-motion"
import { View, TouchableOpacity, Switch } from "react-native"
import { bind } from "decko"

class Message extends Component {
  @bind
  renderContent(type, data, style) {
    const { user: { id, name, color }, small, currentUser } = this.props
    const textColor = fontColorContrast(color)
    const { opacity, offset } = style
    let isCurrentUser = currentUser.id === id ? 1 : 0

    if (type === "remix/text") {
      return (
        <Bubble
          color={color}
          small={small}
          opacity={opacity}
          left={isCurrentUser ? undefined : offset}
          right={isCurrentUser ? offset : undefined}
        >
          <Text tier="body" color={textColor} small={small}>
            {data.text}
          </Text>
        </Bubble>
      )
    }

    if (type === "remix/spotify/track") {
      if (small) {
        return (
          <Bubble
            color={color}
            small={small}
            opacity={opacity}
            left={isCurrentUser ? undefined : offset}
            right={isCurrentUser ? offset : undefined}
          >
            <Icon name="music" size={20} color={"white"} />
            <Spacing size={5} />
            <Text tier="body" color={textColor} small={small}>
              Spotify
            </Text>
          </Bubble>
        )
      }

      return (
        <FrameContainer>
          <iframe
            title="Spotify Track"
            src={`https://open.spotify.com/embed/track/${data.id}`}
            width="300"
            height="380"
            frameborder="0"
            allowtransparency="true"
          />
        </FrameContainer>
      )
    }
  }

  @bind
  onSelect() {
    const { id, addSelectedMessage } = this.props
    addSelectedMessage(id)
  }

  render() {
    const {
      content: { type, data },
      user: { id, name, color },
      readPositions,
      prev,
      currentUser,
      small,
      isSelected,
    } = this.props

    console.log(readPositions)

    let sameUserAsPrev = prev.user && prev.user.id === id
    let isCurrentUser = currentUser.id === id ? 1 : 0
    const space = <Spacing size={6} />

    const align = isCurrentUser ? "flex-end" : "flex-start"

    return (
      <Container iscurrentuser={isCurrentUser}>
        {isSelected && <SelectedRadio />}
        <Motion
          defaultStyle={{ opacity: 0, offset: -15 }}
          style={{ opacity: spring(1), offset: spring(0) }}
        >
          {({ opacity, offset }) => (
            <View>
              {!sameUserAsPrev && (
                <HeaderArea align={align}>
                  <Text tier="messageName" opacity={opacity}>
                    {name}
                  </Text>
                  {space}
                </HeaderArea>
              )}
              <BodyArea align={align}>
                <TouchableOpacity onPress={this.onSelect}>
                  {this.renderContent(type, data, { opacity, offset })}
                </TouchableOpacity>
              </BodyArea>
            </View>
          )}
        </Motion>
        {!small && readPositions.length > 0 && <Spacing size={6} />}
        {readPositions.map(rp => (
          <ReadPos>
            <Icon name="eye" size={22} color={rp.user.color} />
            <Spacing size={5} />
            <Text tier="messageRead">{rp.user.name}</Text>
          </ReadPos>
        ))}
        {space}
      </Container>
    )
  }
}

export default Message

const HeaderArea = styled.View`
  align-items: ${props => props.align};
`
const BodyArea = styled.View`
  align-items: ${props => props.align};
`
const IconArea = styled.View``

const SelectedRadio = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: blue;
`

const ReadPos = styled.View`
  flex-direction: row;
`

const Container = styled.View`
  align-self: ${({ iscurrentuser }) =>
    iscurrentuser ? "flex-end" : "flex-start"};
  align-items: ${({ iscurrentuser }) =>
    iscurrentuser ? "flex-end" : "flex-start"};
`

const Bubble = styled.View`
  padding: 9px 13px;
  border-radius: 20px;
  background-color: ${({ color }) => color || styles.colors.grey[200]};
  max-width: ${props => (props.small ? 200 : 330)}px;
  opacity: ${props => props.opacity};
  flex-direction: row;
  position: relative;
  ${({ left }) => left && `left: ${left};`} ${({ right }) =>
      right && `right: ${right};`};
`

const FrameContainer = styled.View`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${styles.colors.grey[300]};
`
