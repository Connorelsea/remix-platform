import React, { Component, type Node } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Box from "../elements/Box";
import Paragraph from "../elements/Paragraph";
import Spacing from "./Spacing";

type Props = {
  icon: any,
  label: string,
  to: string,
};

class QuickIcons extends Component<Props> {
  render(): Node {
    const size = 100;
    const { icon, label, to } = this.props;
    return (
      <IconContainer to={to}>
        <SvgContainer
          dangerouslySetInnerHTML={{ __html: icon }}
          width={size}
          height={size}
        />

        <Spacing size={10} />
        <Paragraph>{label}</Paragraph>
        <Spacing size={15} />
      </IconContainer>
    );
  }
}

const IconContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
`;

const SvgContainer = styled.svg`
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

export default QuickIcons;
