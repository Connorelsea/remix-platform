// @flow

import React, { Component, type Node } from "react";
import { switchProp } from "styled-tools";
import styled from "styled-components";

export type TitleType = "SUB" | "THIN" | "REGULAR" | "BOLD" | "ERROR";
export type TitleSize = "SMALL" | "MEDIUM" | "LARGE";

type Props = {
  type: TitleType,
  size: TitleSize,
  children?: Node,
};

class Title extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (this.props.type !== nextProps.type) return true;
    if (this.props.size !== nextProps.size) return true;
    if (this.props.children !== nextProps.children) return true;
    return false;
  }

  render(): Node {
    const { children, type, size } = this.props;
    return (
      <Text type={type} size={size}>
        {children}
      </Text>
    );
  }
}

const Text = styled.h1`
  font-size: ${p =>
    switchProp("size", {
      SMALL: `${p.theme.fontSize.title_sm}px`,
      MEDIUM: `${p.theme.fontSize.title_md}px`,
      LARGE: `${p.theme.fontSize.title_lg}px`,
    })};

  font-weight: ${switchProp("type", {
    SUB: "500",
    THIN: "300",
    REGULAR: "400",
    BOLD: "900",
    ERROR: "500",
  })};

  color: ${p =>
    p.type === "ERROR" ? p.theme.text.failure : p.theme.text.primary};

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
    "Helvetica Neue", sans-serif;
  margin: 0;
  padding: 0;
`;

export default Title;
