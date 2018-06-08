import React, { Component, type Node } from "react";
import Box from "../../elements/Box.web";
import TabView from "../TabView";
import ConnectedRouter from "react-router-redux/ConnectedRouter";
import { Route } from "react-router-dom";
import history from "../../utilities/storage/history";
import Dashboard from "../../screens/Dashboard/index";
import SplitPane from "react-split-pane";
import { withTheme } from "styled-components";
import { type Theme } from "../../utilities/theme";

type Props = {
  theme: Theme,
};

type State = {
  showSidebar: boolean,
};

class DesktopView extends Component<Props, State> {
  state = {
    showSidebar: true,
  };

  render(): Node {
    const { theme } = this.props;

    return (
      <SplitPane
        split="vertical"
        minSize={300}
        defaultSize={350}
        resizerStyle={{
          backgroundColor: theme.background.secondary,
          opacity: 1,
        }}
      >
        <Dashboard />
        <TabView />
      </SplitPane>
    );
  }
}

export default withTheme(DesktopView);
