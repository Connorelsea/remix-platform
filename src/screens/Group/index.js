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

type Props = {
  match: {
    params: any,
  },
};

class GroupComponent extends Component<Props> {
  @bind
  renderBody(renderProps: ProvideGroupsRenderProps): Node {
    const { groups, groupsLoading } = renderProps;

    if (groupsLoading) return "loading";

    if (groups && groups.length === 0) return "this user not found";

    const group: Group = groups[0];

    return (
      <div>
        <Box padding="15px">
          <Box>
            <Icon iconUrl={group.iconUrl} iconSize={200} />
          </Box>

          <Spacing size={15} />

          <Box column>
            <Title type="BOLD" size="LARGE">
              {group.name}
            </Title>
            <Subtitle>@{group.username}</Subtitle>
            <Paragraph>{group.description}</Paragraph>
          </Box>
        </Box>
      </div>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GroupComponent)
);
