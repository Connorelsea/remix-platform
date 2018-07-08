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
import { buildGroupUrl } from "../utilities/urls";
import { type Group } from "../types/group";

type Props = {
  group: Group,
};

class GroupCard extends Component<Props> {
  render(): Node {
    const { group } = this.props;
    if (!group) return <div>failed</div>;

    console.log("GROUP", group);

    return (
      <TouchableNewTab full url={buildGroupUrl(group)} iconUrl={group.iconUrl}>
        <Card full>
          <Box row>
            <div>
              <Icon iconUrl={group.iconUrl} />
            </div>
            <SpacingComponent size={10} />
            <Box column>
              <Title type="BOLD" size="MEDIUM">
                {group.name}
              </Title>
              <Subtitle>@{group.username}</Subtitle>

              <Subtitle>{group.description}</Subtitle>
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

export default connect(mapStateToProps)(GroupCard);
