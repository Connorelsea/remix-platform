// @flow

import React, { Component, type Node } from "react";
import { switchProp } from "styled-tools";
import styled from "styled-components/native";

export type TitleType = "SUB" | "THIN" | "REGULAR" | "BOLD";
export type TitleSize = "SMALL" | "MEDIUM" | "LARGE";

type Props = {
  type: TitleType,
  size: TitleSize,
  children?: Node,
};

class Title extends Component<Props> {
  render(): Node {
    const { children, type, size } = this.props;
    return (
      <Text type={type} size={size}>
        {children}
      </Text>
    );
  }
}

const Text = styled.Text`
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
  })};

  color: ${p => p.theme.text.primary};

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;

export default Title;
