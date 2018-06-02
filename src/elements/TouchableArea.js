// @flow

import React, { Component, type Node } from "react";

type Props = {
  onPress: () => any,
  children: Node,
  innerRef?: any => void,
};

class TouchableArea extends Component<Props> {
  render(): Node {
    const { onPress, children, innerRef, ...rest } = this.props;

    return (
      <div role="button" onClick={onPress} ref={innerRef} {...rest}>
        {children}
      </div>
    );
  }
}

export default TouchableArea;
