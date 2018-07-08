import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import { withRouter } from "react-router";
import SplitPane from "react-split-pane";
import { type Theme } from "../../utilities/theme";
import { type Chat as ChatType } from "../../types/chat";

import User from "../User/index";
import Chat from "../Chat/index";
import ProvideChat from "../../providers/ProvideChat";

type Props = {
  theme: Theme,
  match: any,
};

type State = {};

class UserChat extends Component<Props, State> {
  render(): Node {
    const { theme } = this.props;

    return (
      <ProvideChat
        render={props => {
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
              <User />
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

export default withTheme(withRouter(UserChat));
