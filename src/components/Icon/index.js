// @flow

import React, { Component, type Node } from "react";
import styled, { css } from "styled-components";
import { ifProp } from "styled-tools";
import { Circle } from "../../../node_modules/glamorous";

type Props = {
  iconUrl: string,
  iconSize?: number,
  altText?: string,
  circles: Array<{
    color: string,
    onClick: any => any,
    right: ?number,
    left: ?number,
    top: ?number,
    bottom: ?number,
    children: Node,
  }>,
};

class Icon extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (this.props.iconUrl !== nextProps.iconUrl) return true;
    return false;
  }

  render(): Node {
    const { iconUrl, iconSize = 60, altText = "", circles = [] } = this.props;

    return (
      <OuterContainer iconSize={iconSize}>
        {iconUrl !== undefined && (
          <ImageContainer iconSize={iconSize}>
            <img src={iconUrl} alt={altText} />
          </ImageContainer>
        )}
        {circles.map(c => {
          const Container =
            c.onClick !== undefined ? CircleButtonContainer : CircleContainer;
          return (
            <Container
              iconSize={iconSize}
              color={c.color}
              onClick={c.onClick}
              right={c.right}
              left={c.left}
              top={c.top}
              bottom={c.bottom}
            >
              {c.children}
            </Container>
          );
        })}
      </OuterContainer>
    );
  }
}

export default Icon;

const OuterContainer = styled.div`
  position: relative;
  height: ${p => p.iconSize}px;
  width: ${p => p.iconSize}px;
  border-radius: 50%;
  background-color: ${p => p.theme.background.primary};
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: ${p => p.iconSize}px;
  width: ${p => p.iconSize}px;
  border-radius: 50%;

  > img {
    height: ${p => p.iconSize}px;
  }
`;

const sharedCircleStyles = p => css`
  position: absolute;
  border-radius: 50%;
  background-color: ${p => p.color};
  height: ${p => p.iconSize / 3.5}px;
  width: ${p => p.iconSize / 3.5}px;

  display: flex;
  justify-content: center;
  align-items: center;

  ${ifProp(
    "left",
    css`
      left: ${p.left}px;
    `
  )};

  ${ifProp(
    "right",
    css`
      right: ${p.right}px;
    `
  )};

  ${ifProp(
    "bottom",
    css`
      bottom: ${p.bottom}px;
    `
  )};
  ${ifProp(
    "top",
    css`
      top: ${p.top}px;
    `
  )};
`;

const CircleButtonContainer = styled.button`
  ${sharedCircleStyles};
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

const CircleContainer = styled.div`
  ${sharedCircleStyles};
`;
