// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bind } from "decko";

import Title from "../../elements/Title";
import Paragraph from "../../elements/Paragraph";
import Box from "../../elements/Box";
import Spacing from "../../components/Spacing";

import { type Group } from "../../types/group";

import ProvideGroups, {
  type ProvideGroupsRenderProps,
} from "../../providers/ProvideGroups";
import Subtitle from "../../elements/Subtitle";
import Icon from "../../components/Icon";
import styled, { withTheme } from "styled-components";
import { type Theme } from "../../utilities/theme";

import ChatCard from "./ChatCard";

import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";

type Props = {
  match: {
    params: any,
  },
  theme: Theme,
};

class GroupComponent extends Component<Props> {
  @bind
  renderBody(renderProps: ProvideGroupsRenderProps): Node {
    const { groups, groupsLoading } = renderProps;

    if (groupsLoading) return "loading";

    if (groups && groups.length === 0) return "this user not found";

    const group: Group = groups[0];

    const { theme } = this.props;

    return (
      <ScrollContainer>
        <ContentContainer>
          <Box full column>
            <HeaderContainer>
              <Box minWidth={150}>
                <Icon iconUrl={group.iconUrl} iconSize={150} />
              </Box>

              <Spacing size={25} />

              <HeaderContent>
                <Title type="BOLD" size="LARGE">
                  {group.name}
                </Title>
                <Spacing size={10} />
                <Box>
                  <Paragraph fontWeight={800}>{group.members.length}</Paragraph>
                  <Spacing size={3} />
                  <Paragraph color={theme.text.tertiary}>Members</Paragraph>
                  <Spacing size={10} />
                  <Paragraph fontWeight={800}>{group.chats.length}</Paragraph>
                  <Spacing size={3} />
                  <Paragraph color={theme.text.tertiary}>Chats</Paragraph>
                </Box>
                <Spacing size={10} />
                <Subtitle>@{group.username}</Subtitle>
                <Spacing size={10} />
                <Paragraph>{group.description}</Paragraph>
              </HeaderContent>
            </HeaderContainer>
            <Box padding="20px">
              {group.chats.map(chat => (
                <ChatCard group={group} chat={chat} key={chat.id} />
              ))}
            </Box>
          </Box>
        </ContentContainer>
      </ScrollContainer>
    );
  }

  render(): Node {
    const { match } = this.props;
    const params = match.params;

    var ElementQueries = require("css-element-queries/src/ElementQueries");
    ElementQueries.init();

    return (
      <ProvideGroups groupNames={[params.username]} render={this.renderBody} />
    );
  }
}

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const HeaderContainer = styled.div`
  background-color: ${p => p.theme.background.primary};
  display: flex;
  flex: 1 1 auto;
  padding: 15px;

  &[max-width~="400px"] {
    flex-direction: column;
    align-items: center;

    & > ${HeaderContent} {
      align-items: center;
      text-align: center;
    }
  }
`;

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(withRouter(GroupComponent));
