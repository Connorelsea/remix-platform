import React, { Component, type Node } from "react";
import Box from "../../elements/Box.web";
import TabView from "../TabView";
import ConnectedRouter from "react-router-redux/ConnectedRouter";
import { Route } from "react-router-dom";
import history from "../../utilities/storage/history";
import Dashboard from "../../screens/Dashboard/index";

type Props = {};

type State = {
  showSidebar: boolean,
};

class DesktopView extends Component<Props, State> {
  state = {
    showSidebar: true,
  };

  render(): Node {
    return (
      <Box full>
        <Box fullHeight style={{ width: "45%" }}>
          <Dashboard />
        </Box>
        <Box full>
          <TabView />
        </Box>
      </Box>
    );
  }
}

export default DesktopView;
