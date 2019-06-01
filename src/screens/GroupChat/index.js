import React, { Component, type Node } from "react";
import { withRouter } from "react-router";
import SplitPane from "react-flex-split-pane";
import { type Theme } from "../../utilities/theme";
import Group from "../Group/index";
import Chat from "../Chat/index";
import ProvideChat from "../../providers/ProvideChat";

type Props = {
  theme: Theme,
  match: any,
};

type State = {
  size: number,
  isResizing: boolean,
};

class GroupChat extends Component<Props, State> {
  state = {
    size: 450,
    isResizing: false,
  };

  onResizeStart = () => this.setState({ isResizing: true });
  onResizeEnd = () => this.setState({ isResizing: false });
  onChange = size => this.setState({ size });

  render(): Node {
    return (
      <ProvideChat
        render={props => {
          return (
            <SplitPane
              type="vertical"
              size={this.state.size}
              isResizing={this.state.isResizing}
              onResizeStart={this.onResizeStart}
              onResizeEnd={this.onResizeEnd}
              onChange={this.onChange}
            >
              <p>test</p>
              <Group />
              <Chat chat={props.chat} />
            </SplitPane>
          );
        }}
      />
    );
  }
}

export default withRouter(GroupChat);
