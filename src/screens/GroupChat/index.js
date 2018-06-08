import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import { withRouter } from "react-router-dom";
import SplitPane from "react-split-pane";
import { type Theme } from "../../utilities/theme";
import { type Chat as ChatType } from "../../types/chat";

import Group from "../Group/index";
import Chat from "../Chat/index";
import ProvideChat from "../../providers/ProvideChat";

type Props = {
  theme: Theme,
  match: any,
};

type State = {};

class GroupChat extends Component<Props, State> {
  componentDidMount() {}

  render(): Node {
    const { theme } = this.props;

    return (
      <ProvideChat
        render={props => {
          // return <div>{JSON.stringify(props)}</div>;

          return (
            <SplitPane
              split="vertical"
              minSize={300}
              defaultSize={350}
              resizerStyle={{
                backgroundColor: theme.border.primary,
                opacity: 1,
              }}
            >
              <Group />
              <Chat chat={props.chat} />
            </SplitPane>
          );
        }}
      />
    );
  }
}

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
`;

export default withTheme(withRouter(GroupChat));
