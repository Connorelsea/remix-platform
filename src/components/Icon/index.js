// @flow

import React, { Component, type Node } from "react";
import styled from "styled-components";

type Props = {
  iconUrl: string,
  iconSize?: number,
  altText?: string,
};

class Icon extends Component<Props> {
  render(): Node {
    const { iconUrl, iconSize = 60, altText = "a round icon" } = this.props;
    return (
      <ImageContainer iconSize={iconSize}>
        <img src={iconUrl} alt={altText} />
      </ImageContainer>
    );
  }
}

export default Icon;

const ImageContainer = styled.div`
  height: ${p => p.iconSize}px;
  width: ${p => p.iconSize}px;
  overflow: hidden;
  border-radius: 50%;

  > img {
    height: ${p => p.iconSize}px;
  }
`;
