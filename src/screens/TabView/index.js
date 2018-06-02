// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab as TabType } from "../../types/tab";
import { Route } from "react-router-dom";
import UserComponent from "../User";
import GroupComponent from "../Group/index";
import TabBar from "../../components/TabBar";

type Props = {
  tabs: Array<TabType>,
};

class TabView extends Component<Props> {
  render(): Node {
    const { tabs } = this.props;
    return (
      <div>
        <TabBar />

        <div>
          <Route exact path="/u/:username" component={UserComponent} />
          <Route exact path="/g/:username" component={GroupComponent} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    tabs: state.tabs.tabs,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TabView);
