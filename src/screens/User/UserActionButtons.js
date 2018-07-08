import React, { Component, Fragment, type Node } from "react";

import Button from "../../elements/Button";

import { type Group } from "../../types/group";
import { type User } from "../../types/user";

import { buildEditUserUrl } from "../../utilities/urls";

type Props = {
  user: User,
  group: Group,
  currentUserId: string,
};

class UserActionButtons extends Component<Props> {
  render(): Node {
    const { user, group, currentUserId } = this.props;

    if (user.id === currentUserId) {
      return (
        <Fragment>
          <Button
            size="MEDIUM"
            type="DEFAULT"
            title="Edit Profile"
            to={buildEditUserUrl(user)}
          />
        </Fragment>
      );
    }

    if (group !== undefined) {
      return (
        <Fragment>
          <Button size="MEDIUM" type="DEFAULT" title="Unfriend" />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Button
          size="MEDIUM"
          type="EMPHASIS"
          title="Add Friend"
          onClick={() => this.sendFriendRequest(user.id)}
        />
      </Fragment>
    );
  }
}

export default UserActionButtons;
