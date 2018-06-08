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
import { withTheme } from "styled-components";
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
          <Box fullWidth column>
            <Box padding="20px" backgroundColor={theme.background.primary}>
              <Box minWidth={150}>
                <Icon iconUrl={group.iconUrl} iconSize={150} />
              </Box>

              <Spacing size={25} />

              <Box column>
                <Title type="BOLD" size="LARGE">
                  {group.name}
                </Title>
                <Spacing size={10} />
                <Paragraph>
                  {group.members.length} {group.chats.length}
                </Paragraph>
                <Spacing size={10} />
                <Subtitle>@{group.username}</Subtitle>
                <Spacing size={10} />
                <Paragraph>{group.description}</Paragraph>
              </Box>
            </Box>
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

    return (
      <ProvideGroups groupNames={[params.username]} render={this.renderBody} />
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupComponent))
);
