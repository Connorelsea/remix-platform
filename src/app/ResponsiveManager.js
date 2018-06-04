import React, { Component, type Node } from "react";
import Measure from "react-measure";
import DesktopView from "../screens/DesktopView";
import MobileView from "../screens/MobileView";
import { bind } from "decko";

type Props = {};

type State = {
  width: number,
  height: number,
};

class ResponsiveManager extends Component<Props, State> {
  state = {
    width: 0,
    height: 0,
  };

  render(): Node {
    return (
      <Measure bounds onResize={this.onResize}>
        {this.renderBody}
      </Measure>
    );
  }

  @bind
  renderBody({ measureRef }) {
    const { width } = this.state;

    return (
      <div ref={measureRef} style={{ height: "100%", width: "100%" }}>
        {width >= 800 ? <DesktopView /> : <MobileView />}
      </div>
    );
  }

  @bind
  onResize(contentRect) {
    this.setState({ ...contentRect.bounds });
  }
}

export default ResponsiveManager;
