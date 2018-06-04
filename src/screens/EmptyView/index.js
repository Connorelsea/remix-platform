import React, { Component, type Node } from "react";

type Props = {};

class EmptyView extends Component<Props> {
  render(): Node {
    return <div style={{ height: "100%" }}> Empty</div>;
  }
}

export default EmptyView;
