// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab as TabType } from "../../types/tab";
import { Route, Switch } from "react-router-dom";
import UserComponent from "../User";
import GroupComponent from "../Group/index";
import TabBar from "../../components/TabBar";
import EmptyView from "../EmptyView";
import Box from "../../elements/Box.web";
import NewTab from "../NewTab";
import AllTabs from "../AllTabs";

type Props = {};

class TabView extends Component<Props> {
  render(): Node {
    return (
      <Box full column>
        <TabBar />

        <Switch>
          <Route exact path="/" component={EmptyView} />
          <Route exact path="/tabs/new" component={NewTab} />
          <Route exact path="/tabs/all" component={AllTabs} />
          <Route exact path="/u/:username" component={UserComponent} />
          <Route exact path="/g/:username" component={GroupComponent} />
        </Switch>
      </Box>
    );
  }
}

export default TabView;
