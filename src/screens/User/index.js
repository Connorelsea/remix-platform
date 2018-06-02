// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bind } from "decko";

import Title from "../../elements/Title";
import Paragraph from "../../elements/Paragraph";
import Icon from "../../components/Icon/index";
import Box from "../../elements/Box";
import Spacing from "../../components/Spacing";

import { type User } from "../../types/user";

import ProvideUsers, {
  type ProvideUsersRenderProps,
} from "../../providers/ProvideUsers";
import Subtitle from "../../elements/Subtitle";

type Props = {
  match: {
    params: any,
  },
};

class UserComponent extends Component<Props> {
  @bind
  renderBody(renderProps: ProvideUsersRenderProps): Node {
    const { users, usersLoading } = renderProps;

    if (usersLoading) return "loading";

    if (users && users.length === 0) return "this user not found";

    const user: User = users[0];

    return (
      <div>
        <Box padding="15px">
          <Box>
            <Icon iconUrl={user.iconUrl} iconSize={200} />
          </Box>

          <Spacing size={15} />

          <Box column>
            <Title type="BOLD" size="LARGE">
              {user.name}
            </Title>
            <Subtitle>@{user.username}</Subtitle>
            <Paragraph>{user.description}</Paragraph>
          </Box>
        </Box>
      </div>
    );
  }

  render(): Node {
    const { match } = this.props;
    const params = match.params;

    return (
      <ProvideUsers userNames={[params.username]} render={this.renderBody} />
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
  connect(mapStateToProps, mapDispatchToProps)(UserComponent)
);
