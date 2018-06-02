// @flow

import React, { Component, type Node } from "react";
import Card from "./Card";
import Text from "./Text";
import Button from "./Button";
import { View } from "react-native";
import Spacing from "./Spacing";
import { type Device } from "../types/device";
import { connect } from "react-redux";
import user from "../ducks/user";
import { type User } from "../types/user";
import Box from "../elements/Box";
import TagLabel from "../elements/TagLabel";
import Title from "../elements/Title";

type Props = {
  device: Device,
  user: User,
};

class DeviceCard extends Component<Props> {
  render(): Node {
    const { device, user } = this.props;

    return (
      <Card>
        <Box justifyBetween>
          <Box column>
            <Title type="BOLD" size="MEDIUM">
              {user.name}
            </Title>
            <Spacing size={5} />
            <Text tier="subtitle">@{user.username}</Text>
            <Spacing size={5} />
            <Text tier="subtitle">{device.name}</Text>
            <Spacing size={5} />
          </Box>
          <Box column justifyCenter alignEnd>
            <TagLabel>Not Trusted</TagLabel>
            <Spacing size={10} />
            <TagLabel>Expired</TagLabel>
          </Box>
        </Box>
      </Card>
    );
  }
}

export default DeviceCard;
