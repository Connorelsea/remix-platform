import React, { Component, type Node } from "react";
import { withRouter } from "react-router-dom";
import SplitPane from "react-flex-split-pane";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

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
    if (nextProps.location.pathname !== this.props.location.pathname)
      return true;
    return false;
  }

  render(): Node {
    return (
      <ReflexContainer orientation="vertical">
        <ReflexElement minSize="300" maxSize="450">
          <Dashboard />
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement>
          <TabView />
        </ReflexElement>
      </ReflexContainer>
    );
  }
}

export default withRouter(DesktopView);
