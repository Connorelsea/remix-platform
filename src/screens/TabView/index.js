// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab as TabType } from "../../types/tab";
import { Route, Switch } from "react-router-dom";
import UserComponent from "../User";
import GroupComponent from "../Group/index";
import Chat from "../Chat/index";
import TabBar from "../../components/TabBar";
import EmptyView from "../EmptyView";
import Box from "../../elements/Box.web";
import NewTab from "../NewTab";
import AllTabs from "../AllTabs";
import styled, { withTheme } from "styled-components";

import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";
import { type Theme } from "../../utilities/theme";

type Props = {
  theme: Theme,
};

class TabView extends Component<Props> {
  render(): Node {
    const { theme } = this.props;
    return (
      <Box full column>
        <TabBar />

        <ScrollContainer>
          <ContentContainer
            style={{ borderLeft: `1px solid ${theme.border.secondary}` }}
          >
            <Switch>
              <Route exact path="/" component={EmptyView} />
              <Route exact path="/tabs/new" component={NewTab} />
              <Route exact path="/tabs/all" component={AllTabs} />
              <Route exact path="/u/@:username" component={UserComponent} />
              <Route exact path="/g/+:username" component={GroupComponent} />
              <Route exact path="/g/+:username/:chat" component={Chat} />
            </Switch>
          </ContentContainer>
        </ScrollContainer>
      </Box>
    );
  }
}

export default withTheme(TabView);
