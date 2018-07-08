import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import Card from "../elements/Card";
import Title from "../elements/Title";
import Subtitle from "../elements/Subtitle";
import Box from "../elements/Box";
import Icon from "../components/Icon/index";
import SpacingComponent from "../components/Spacing";
import TouchableNewTab from "../elements/TouchableNewTab";
import { type User } from "../types/user";
import { buildUserUrl } from "../utilities/urls";

type Props = {
  user: User,
};

class UserCard extends Component<Props> {
  render(): Node {
    const { user } = this.props;
    if (!user) return <div>failed</div>;

    console.log("USER", user);

    return (
      <TouchableNewTab full url={buildUserUrl(user)} iconUrl={user.iconUrl}>
        <Card full>
          <Box row>
            <div>
              <Icon iconUrl={user.iconUrl} />
            </div>
            <SpacingComponent size={10} />
            <Box column>
              <Title type="BOLD" size="MEDIUM">
                {user.name}
              </Title>
              <Subtitle>@{user.username}</Subtitle>

              <Subtitle>{user.description}</Subtitle>
            </Box>
          </Box>
        </Card>
      </TouchableNewTab>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps)(UserCard);
