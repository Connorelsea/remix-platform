import React, { Component, type Node } from "react";

class DisplayJson extends Component<Props> {
  render(): Node {
    return <pre>{JSON.stringify(this.props.children, null, 2)}</pre>;
  }
}

export default DisplayJson;
