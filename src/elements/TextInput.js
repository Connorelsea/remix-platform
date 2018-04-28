// @flow

import React, { Component, type Node } from "react";
import styled from "styled-components";

type Props = {
  value: string,
  placeholder?: string,
  secure?: boolean,
  onChange: any
};

class TextInput extends Component<Props> {
  render(): Node {
    return <StyledInput {...this.props} />;
  }
}

export default TextInput;

const StyledInput = styled.input`
  border: 1px solid ${p => p.theme.background.tertiary};
  border-radius: 100px;
  background-color: ${p => p.theme.background.primary};
  margin: 0px;
  padding: 14px 18px;
  width: 100%;
  font-size: ${p => p.theme.fontSize.body}px;
  color: ${p => p.theme.text.primary};
  outline: none;

  &:focus {
    box-shadow: 0 0 3pt 2pt ${p => p.theme.appColors.inputOutline};
  }
`;
