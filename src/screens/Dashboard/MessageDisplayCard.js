import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import Card from "../../elements/Card";
import Title from "../../elements/Title";
import Subtitle from "../../elements/Subtitle";
import Box from "../../elements/Box";
import { type Group } from "../../types/group";
import Icon from "../../components/Icon/index";
import SpacingComponent from "../../components/Spacing";
import TouchableNewTab from "../../elements/TouchableNewTab";

type Props = {
  group: Group,
};

class MessageDisplayCard extends Component<Props> {
  render(): Node {
    const { group } = this.props;

    const url = group.isDirectMessage
      ? `/u/${group.username}`
      : `/g/${group.username}`;

    if (!group) return <div>failed</div>;

    console.log("GROUP", group);

    return (
      <TouchableNewTab url={url}>
        <Card>
          <Box>
            <div>
              <Icon iconUrl={group.iconUrl} />
            </div>
            <SpacingComponent size={10} />
            <div>
              <Title type="BOLD" size="MEDIUM">
                {group.name}
              </Title>

              <Subtitle>{group.description}</Subtitle>
            </div>
          </Box>
        </Card>
      </TouchableNewTab>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps)(MessageDisplayCard);
