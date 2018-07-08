import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import Card from "../../elements/Card";
import Title from "../../elements/Title";
import Subtitle from "../../elements/Subtitle";
import Box from "../../elements/Box";
import Icon from "../../components/Icon/index";
import SpacingComponent from "../../components/Spacing";
import TouchableNewTab from "../../elements/TouchableNewTab";
import { buildUserUrl, buildGroupUrl } from "../../utilities/urls";
import { type User } from "../../types/user";

type Props = {
  user: User,
};

class SelfUserDisplayCard extends Component<Props> {
  render(): Node {
    const { user } = this.props;

    const url = buildUserUrl(user);

    if (!user) return <div>failed</div>;

    return (
      <TouchableNewTab url={url} iconUrl={user.iconUrl}>
        <Card>
          <Box>
            <div>
              <Icon iconUrl={user.iconUrl} />
            </div>
            <SpacingComponent size={10} />
            <div>
              <Title type="BOLD" size="MEDIUM">
                {user.name}
              </Title>

              <Subtitle>{user.description}</Subtitle>
            </div>
          </Box>
        </Card>
      </TouchableNewTab>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    user: state.identity.users.find(u => u.id === state.identity.currentUserId),
  };
}

export default connect(mapStateToProps)(SelfUserDisplayCard);
