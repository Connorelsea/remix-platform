//@flow

import React, { Component, type Node } from "react";
import { withRouter } from "react-router";
import styled, { withTheme, css } from "styled-components";
import Paragraph from "./Paragraph";
import prop from "styled-tools/dist/cjs/prop";
import { bind, memoize } from "decko";

type ButtonSize = "SMALL" | "MEDIUM";
type ButtonType = "DISABLED" | "CLEAR" | "DEFAULT" | "EMPHASIS";

type Props = {
  title: string,
  size: ButtonSize,
  type?: ButtonType,
  children: Node,
  theme: any,
  to: string,
  onClick?: any,
  disabled?: boolean,
  icon?: Node,
};

type State = {};

class Button extends Component<Props, State> {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.title !== nextProps.title) return true;
    if (this.props.children !== nextProps.children) return true;
    if (this.props.to !== nextProps.to) return true;
    if (this.props.disabled !== nextProps.disabled) return true;

    return false;
  }

  @bind
  onLinkClick() {
    this.props.history.push(this.props.to);
    if (this.props.onClick !== undefined) this.props.onClick();
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
      type,
      children,
      theme,
      to,
      onClick = this.onClick,
      disabled = false,
      icon,
    } = this.props;

    const { getButtonTheme } = this;

    console.log(size, size === "SMALL");

    return (
      <Container
        onClick={to === undefined ? onClick : this.onLinkClick}
        borderRadius={size === "SMALL" ? 8 : 200}
        padding={size === "SMALL" ? "0px 10px" : "0px 15px"}
        minHeight={size === "SMALL" ? 30 : 50}
        disabled={disabled}
        getButtonTheme={getButtonTheme}
        type={type}
      >
        {icon ? icon : undefined}
        <Paragraph
          fontSize={
            size === "SMALL"
              ? theme.fontSize.button_sm
              : theme.fontSize.button_md
          }
          fontWeight={type === "CLEAR" && "inherit"}
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

  display: flex;
  align-items: center;
  justify-content: space-around;

  font-weight: 500;

  &:hover {
    background-color: ${p => p.getButtonTheme().hover};
    border-bottom: 4px solid ${p => p.getButtonTheme().hover_bottom};
    transform: scale(1.05);
    cursor: pointer;

    ${p =>
      p.type === "CLEAR" &&
      css`
        font-weight: 700;
      `};
  }

  &:active {
    background-color: ${p => p.getButtonTheme().active};
    border-bottom: 1px solid ${p => p.getButtonTheme().active_bottom};
    transform: scale(0.97);
  }
`;
