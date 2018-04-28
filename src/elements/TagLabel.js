// @flow

import React, { Component, type Node } from "react";
import styled from "styled-components";
import { prop } from "styled-tools";
import Label from "./Label";

type Props = {
  children: Node,
  backgroundColor?: string,
  textColor?: string
};

class TagLabel extends Component<Props> {
  render(): Node {
    const { children, backgroundColor, textColor } = this.props;

    return (
      <Container backgroundColor={backgroundColor} textColor={textColor}>
        <Label>{children}</Label>
      </Container>
    );
  }
}

export default TagLabel;

const Container = styled.div`
  background: ${p => prop("backgroundColor", p.theme.background.secondary)};
  color: ${p => prop("textColor", p.theme.text.primary)};
  border-radius: 8px;
`;
