import React, { Component } from "react";
import styled from "styled-components/native";
import { withRouter } from "react-router";
import styles from "../utilities/styles";
import { bind } from "decko";
import Spacing from "./Spacing";
import Text from "./Text";

class Button extends Component {
  @bind
  onLinkPress() {
    this.props.history.push(this.props.to);
  }

  render() {
    const {
      onPress,
      to,
      title,
      icon,
      small,
      disabled,
      type = "default"
    } = this.props;

    // const clonedIcon = React.cloneElement(icon, { key: "icon", ...icon })

    let props = {};

    if (disabled)
      props = {
        small,
        disabled: true,
        type
      };
    else
      props = {
        onPress: to === undefined ? onPress : this.onLinkPress,
        small,
        type
      };

    return (
      <Opacity {...props}>
        <Inner>
          <Text tier="body" small={small} button={type}>
            {title}
          </Text>
          {icon && [<Spacing key="spacing" size={10} />, icon]}
        </Inner>
      </Opacity>
    );
  }
}

export default withRouter(Button);

const Inner = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Opacity = styled.TouchableOpacity`
  padding: ${({ small }) => (small ? "8px 15px" : "12px 17px")};
  background-color: ${({ type, theme }) => theme.button[type].background};
  overflow: hidden;
  border-radius: ${({ small }) => (small ? 20 : 50)}px;
  align-items: center;
  justify-content: center;
  ${props => (props.disabled ? "cursor: not-allowed" : undefined)};
`;
