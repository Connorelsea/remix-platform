import React, { Component, Node } from "React";
import styled from "styled-components";

type Props = {
  size: string,
  color: string,
  fullWidth?: boolean,
};

class SpacingComponent extends Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render(): Node {
    const { size, color, fullWidth = false } = this.props;
    return <Spacing size={size} color={color} fullWidth={fullWidth} />;
  }
}

const Spacing = styled.div`
  height: ${props => props.size}px;
  background-color: ${props => props.color || "transparent"};
  width: ${props => {
    return props.fullwidth ? "100%" : props.size + "px";
  }};
`;

export default SpacingComponent;
