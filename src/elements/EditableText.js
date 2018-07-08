import React, { Component, type Node } from "react";
import styled, { css } from "styled-components";

type Props = {
  children: Node,
  editing: boolean,
  onChange?: any => any,
  themeColor?: string,
  themeFontSize?: string,
  color?: string,
  fontSize?: number,
  fontWeight?: number,
};

class EditableText extends Component<Props> {
  render(): Node {
    const {
      children,
      editing,
      onChange,
      themeColor,
      themeFontSize,
      color,
      fontSize,
      fontWeight,
    } = this.props;

    const Container = editing ? Input : Text;

    return (
      <Container
        editing={editing}
        onChange={onChange}
        themeColor={themeColor}
        themeFontSize={themeFontSize}
        color={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        value={editing === true ? children : undefined}
      >
        {editing === false ? children : undefined}
      </Container>
    );
  }
}

export default EditableText;

const shared = p => css`
  font-size: ${p.themeFontSize !== undefined
    ? p.theme.fontSize[p.themeFontSize]
    : p.fontSize}px;
  color: ${p.themeColor !== undefined ? p.theme.text[p.themeColor] : p.color};
  font-weight: ${p.fontWeight !== undefined ? p.fontWeight : 500};
`;

const Input = styled.input`
  ${shared};
  background: transparent;
  border: 0;
  outline: 0;
`;

const Text = styled.p`
  ${shared};
`;
