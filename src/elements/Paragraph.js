// @flow

import React, { Component, type Node } from "react";
import { ifProp, prop } from "styled-tools";
import styled, { css } from "styled-components";

type Props = {
  children?: Node,
  color?: string,
  center?: boolean,
  fontSize?: number
};

class Paragraph extends Component<Props> {
  render(): Node {
    const { children, color, center, fontSize } = this.props;
    return (
      <Text color={color} center={center} fontSize={fontSize}>
        {children}
      </Text>
    );
  }
}

const Text = styled.p`
  ${ifProp(
    "center",
    css`
      text-align: center;
    `
  )};

  margin: 0;
  font-weight: 500;
  font-size: ${p => prop("fontSize", p.theme.fontSize.body)}px;
  color: ${p => p.color || p.theme.text.secondary};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`;

export default Paragraph;
