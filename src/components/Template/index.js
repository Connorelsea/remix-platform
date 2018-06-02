// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";

type Props = {
  items: Array<any>,
};

class TabBar extends Component<Props> {
  render(): Node {
    const { items } = this.props;
    return (
      <div>
        <p>Items</p>
        {items.map(i => <p>{JSON.stringify(i)}</p>)}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
