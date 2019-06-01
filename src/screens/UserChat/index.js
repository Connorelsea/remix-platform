import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import { withRouter } from "react-router";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import { type Theme } from "../../utilities/theme";
import { type Chat as ChatType } from "../../types/chat";

import User from "../User/index";
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

class UserChat extends Component<Props, State> {
  state = {
    size: 450,
    isResizing: false,
  };

  onResizeStart = () => this.setState({ isResizing: true });
  onResizeEnd = () => this.setState({ isResizing: false });
  onChange = size => this.setState({ size: Math.max(size, 250) });

  render(): Node {
    return (
      <ProvideChat
        render={props => {
          return (
            <ReflexContainer orientation="vertical">
              <ReflexElement minSize="300" maxSize="450">
                <User />
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement>
                <Chat chat={props.chat} />
              </ReflexElement>
            </ReflexContainer>
          );
        }}
      />
    );
  }
}

export default withRouter(UserChat);
