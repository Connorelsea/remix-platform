import React, { Component, type Node } from "react";
import SplitPane from "react-flex-split-pane";
import TabView from "../TabView";
import Dashboard from "../../screens/Dashboard/index";

type Props = {};

type State = {
  showSidebar: boolean,
  size: number,
  isResizing: boolean,
};

class DesktopView extends Component<Props, State> {
  state = {
    showSidebar: true,
    size: 450,
    isResizing: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showSidebar !== this.state.showSidebar) return true;
    if (nextState.size !== this.state.size) return true;
    if (nextState.isResizing === true) return true;
    return false;
  }

  onResizeStart = () => this.setState({ isResizing: true });
  onResizeEnd = () => this.setState({ isResizing: false });
  onChange = size => this.setState({ size });

  render(): Node {
    return (
      <SplitPane
        type="vertical"
        size={this.state.size}
        isResizing={this.state.isResizing}
        onResizeStart={this.onResizeStart}
        onResizeEnd={this.onResizeEnd}
        onChange={this.onChange}
      >
        <Dashboard />
        <TabView />
      </SplitPane>
    );
  }
}

export default DesktopView;
