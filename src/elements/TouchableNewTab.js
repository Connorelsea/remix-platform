// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab, createTabObject } from "../types/tab";
import { createTab } from "../ducks/tabs";
import { withRouter, Link } from "react-router-dom";

type Props = {
  url: string,
  children: Node,
  createTab: (tab: Tab) => any,
  history: any,
};

class TouchableNewTab extends Component<Props> {
  @bind
  onPress() {
    const { url, createTab, history } = this.props;
    // history.push(url);
    createTab(
      createTabObject({
        title: url,
        url,
      })
    );
  }

  render(): Node {
    const { children, url } = this.props;
    const { onPress } = this;

    return (
      <Link to={url} onClick={onPress}>
        {children}
      </Link>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createTab: (tab: Tab) => dispatch(createTab(tab)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TouchableNewTab)
);
