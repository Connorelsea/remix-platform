// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab as TabType } from "../../types/tab";
import { Route, Switch, withRouter } from "react-router-dom";
import UserComponent from "../User";
import UserChat from "../UserChat";
import GroupComponent from "../Group/index";
import GroupChat from "../GroupChat/index";
import TabBar from "../../components/TabBar";
import EmptyView from "../EmptyView";
import Box from "../../elements/Box.web";
import NewTab from "../NewTab";
import AllTabs from "../AllTabs";
import styled, { withTheme } from "styled-components";

import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";
import { type Theme } from "../../utilities/theme";
import Storage from "../Storage/index";
import GroupNew from "../GroupNew/index";
import UserEditProfile from "../UserEditProfile";

type Props = {
  theme: Theme,
};

class TabView extends Component<Props> {
  render(): Node {
    return (
      <Box full column>
        <TabBar />

        <Outline>
          <ScrollContainer>
            {/* <ContentContainer> */}
            <Switch>
              <Route exact path="/" component={EmptyView} />
              <Route exact path="/tabs/new" component={() => <NewTab />} />
              <Route exact path="/tabs/all" component={AllTabs} />
              <Route path="/storage" component={Storage} />
              <Route
                exact
                path="/edit/u/@:username"
                component={UserEditProfile}
              />
              <Route exact path="/u/@:username" component={UserComponent} />
              <Route exact path="/u/@:username/:chat" component={UserChat} />
              <Route exact path="/g/+:username" component={GroupComponent} />
              <Route exact path="/g/+:username/:chat" component={GroupChat} />
              <Route exact path="/g/new" component={GroupNew} />
            </Switch>
            {/* </ContentContainer> */}
          </ScrollContainer>
        </Outline>
      </Box>
    );
  }
}

const Outline = styled.div`
  border: 1px solid ${p => p.theme.border.secondary};
  border-bottom: 0;
  border-right: 0;
  height: 100%;
  width: 100%;
`;

export default withRouter(TabView);
