// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab, createTabObject } from "../types/tab";
import { createNewTab } from "../ducks/tabs";
import { withRouter, Link } from "react-router-dom";

type Props = {
  url: string,
  title?: string,
  subtitle?: string,
  iconUrl?: string,
  children: Node,
  createNewTab: (
    url: string,
    title?: string,
    subtitle?: string,
    iconUrl?: string
  ) => any,
};

class TouchableNewTab extends Component<Props> {
  @bind
  onPress() {
    const { url, title, subtitle, iconUrl, createNewTab } = this.props;

    createNewTab(url, title !== undefined ? title : url, subtitle, iconUrl);
  }

  render(): Node {
    const { children, url } = this.props;
    const { onPress } = this;

    return (
      <Link to={url} onClick={onPress} style={{ textDecoration: "none" }}>
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
    createNewTab: (
      url: string,
      title?: string,
      subtitle?: string,
      iconUrl?: string
    ) => dispatch(createNewTab(url, title, subtitle, iconUrl)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TouchableNewTab);
