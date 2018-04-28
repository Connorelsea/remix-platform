//@flow

import React, { Component, type Node } from "react";
import { withRouter } from "react-router";
import styled, { withTheme } from "styled-components";
import Paragraph from "./Paragraph";
import prop from "styled-tools/dist/cjs/prop";
import { bind, memoize } from "decko";

type ButtonSize = "SMALL" | "MEDIUM";
type ButtonType = "DISABLED" | "DEFAULT" | "EMPHASIS";

type Props = {
  title: string,
  size: ButtonSize,
  type?: ButtonType,
  children: Node,
  theme: any,
  to: string,
  onClick?: any,
  disabled?: boolean
};

type State = {};

class Button extends Component<Props, State> {
  state = {};

  @bind
  onLinkClick() {
    this.props.history.push(this.props.to);
  }

  onClick() {
    console.log("clicked");
  }

  @bind
  getButtonTheme() {
    const { disabled, type = "DEFAULT", theme } = this.props;
    let themeKey;
    if (disabled) themeKey = "disabled";
    else themeKey = type.toLowerCase();
    return theme.button[themeKey];
  }

  render(): Node {
    const {
      title,
      size,
      children,
      theme,
      to,
      onClick = this.onClick,
      disabled = false
    } = this.props;

    const { getButtonTheme } = this;

    console.log(size, size === "SMALL");

    return (
      <Container
        onClick={to === undefined ? onClick : this.onLinkClick}
        borderRadius={size === "SMALL" ? 8 : 200}
        padding={size === "SMALL" ? "0px 10px" : "0px 15px"}
        minHeight={size === "SMALL" ? 35 : 50}
        disabled={disabled}
        getButtonTheme={getButtonTheme}
      >
        <Paragraph
          fontSize={
            size === "SMALL"
              ? theme.fontSize.button_sm
              : theme.fontSize.button_md
          }
          color={getButtonTheme().text}
        >
          {title || children}
        </Paragraph>
      </Container>
    );
  }
}

export default withRouter(withTheme(Button));

const Container = styled.button`
  background-color: ${p => p.getButtonTheme().background};
  border-radius: ${prop("borderRadius")}px;
  padding: ${prop("padding")};
  min-height: ${prop("minHeight")}px;
  margin: 0px;
  border: 0;
  border-bottom: 2px solid ${p => p.getButtonTheme().bottom};
  transition: all 0.25s;

  &:hover {
    background-color: ${p => p.getButtonTheme().hover};
    border-bottom: 4px solid ${p => p.getButtonTheme().hover_bottom};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${p => p.getButtonTheme().active};
    border-bottom: 1px solid ${p => p.getButtonTheme().active_bottom};
    transform: scale(0.97);
  }
`;
