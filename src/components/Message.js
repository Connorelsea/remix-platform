import React, { Component } from "react";
import styled from "styled-components/native";
import styles from "../utilities/styles";
import Text from "../components/Text";
import Spacing from "../components/Spacing";
import fontColorContrast from "font-color-contrast";
import Icon from "react-native-vector-icons/dist/Feather";
import { Motion, spring } from "react-motion";
import { View, TouchableOpacity } from "react-native";
import { bind } from "decko";

class Message extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.user.color !== this.props.user.color) {
      return true;
    }

    if (nextProps.user.name !== this.props.user.name) {
      return true;
    }

    if (
      nextProps.content.type === "remix/text" &&
      nextProps.content.data.text !== this.props.content.data.text
    ) {
      return true;
    }

    if (nextProps.readPositions !== this.props.readPositions) {
      return true;
    }

    return false;
  }

  @bind
  renderContent(type, data, style) {
    const { user: { id, name, color }, small, currentUser } = this.props;
    const textColor = fontColorContrast(color);
    const { opacity, offset } = style;
    let isCurrentUser = currentUser.id === id ? 1 : 0;

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
            {small
              ? data.text.length > 35
                ? data.text.slice(0, 35) + "..."
                : data.text
              : data.text}
          </Text>
        </Bubble>
      );
    } else if (type === "remix/spotify/track") {
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
        );
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
      );
    } else if (type === "remix/spotify/album") {
      //https://open.spotify.com/embed/album/1BzMONuUlgUnqOrg2aQeAY
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
              Spotify Album
            </Text>
          </Bubble>
        );
      }

      return (
        <FrameContainer>
          <iframe
            title="Spotify Track"
            src={`https://open.spotify.com/embed/album/${data.id}`}
            width="300"
            height="380"
            frameborder="0"
            allowtransparency="true"
          />
        </FrameContainer>
      );
    }
  }

  @bind
  onSelect() {
    const { id, addSelectedMessage } = this.props;
    addSelectedMessage(id);
  }

  render() {
    const {
      content: { type, data },
      user: { id, name, color },
      readPositions,
      prev,
      currentUser,
      small,
      isSelected
    } = this.props;

    let sameUserAsPrev = prev.user && prev.user.id === id;
    let isCurrentUser = currentUser.id === id ? 1 : 0;
    const space = <Spacing size={6} />;

    const align = isCurrentUser ? "flex-end" : "flex-start";

    return (
      <Row>
        <Container iscurrentuser={isCurrentUser}>
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
      </Row>
    );
  }
}

export default Message;

const Row = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 0px 15px;
`;

const HeaderArea = styled.View`
  align-items: ${props => props.align};
`;
const BodyArea = styled.View`
  align-items: ${props => props.align};
`;
const IconArea = styled.View``;

const SelectedRadio = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: blue;
`;

const ReadPos = styled.View`
  flex-direction: row;
`;

const Container = styled.View`
  align-self: ${({ iscurrentuser }) =>
    iscurrentuser ? "flex-end" : "flex-start"};
  align-items: ${({ iscurrentuser }) =>
    iscurrentuser ? "flex-end" : "flex-start"};
  flex: 1;
`;

const Bubble = styled.View`
  padding: ${props => (props.small ? "5px 11px" : "9px 13px")};
  border-radius: 20px;
  background-color: ${({ color }) => color || styles.colors.grey[200]};
  max-width: ${props => (props.small ? 200 : 330)}px;
  opacity: ${props => props.opacity};
  flex-direction: row;
  position: relative;
  ${({ left }) => left && `left: ${left};`} ${({ right }) =>
    right && `right: ${right};`};
`;

const FrameContainer = styled.View`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${styles.colors.grey[300]};
`;
