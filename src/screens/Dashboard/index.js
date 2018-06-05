// @flow

import React, { Component, type Node } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import AppScrollContainer from "../../components/AppScrollContainer";
import Subtitle from "../../elements/Subtitle";
import DisplayJson from "../../elements/DisplayJson";
import ProvideUsers, {
  type ProvideUsersRenderProps,
} from "../../providers/ProvideUsers";
import { bind } from "decko";
import Icon from "../../components/Icon/index";
import MessageDisplayCard from "./MessageDisplayCard";
import { type User } from "../../types/user";
import SpacingComponent from "../../components/Spacing";
import { getGroups } from "../../ducks/groups/index.js";
import { type Tab } from "../../types/tab";
import { type Group } from "../../types/group";
import TabBar from "../../components/TabBar";
import Box from "../../elements/Box.web";

import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";
import InnerContentContainer from "../../elements/InnerContentContainer";
import TabControls from "../../components/TabControls/index";

type Props = {
  friends: Array<User>,
  groups: Array<Group>,
  tabs: Array<Tab>,
};

class Dashboard extends Component<Props> {
  render(): Node {
    const { friends } = this.props;
    const friendIds = friends.map(f => f.id);

    return <ProvideUsers userIds={[...friendIds]} render={this.renderBody} />;
  }

  @bind
  renderBody(bodyProps: ProvideUsersRenderProps): Node {
    const { users, usersLoading } = bodyProps;
    const { friends, groups } = this.props;

    if (usersLoading) return "loading users";

    return (
      <ScrollContainer>
        <ContentContainer>
          <Box column padding="25px">
            <TabControls />
            <SpacingComponent size={20} />
            <Subtitle>Notifications</Subtitle>
            <SpacingComponent size={15} />
            <div>Hello World Dashboard</div>

            <SpacingComponent size={25} />
            <Subtitle>Online Friends</Subtitle>
            <SpacingComponent size={15} />
            {friends.map(f => {
              const foundUser: ?User = users.find(u => f.id === u.id);
              if (!foundUser) return "not found";
              return <Icon key={f.id} iconUrl={foundUser.iconUrl} />;
            })}

            <SpacingComponent size={25} />
            <Subtitle>Recent Messages</Subtitle>
            <SpacingComponent size={15} />
            {groups.map(g => [
              <MessageDisplayCard key={g.id} group={g} />,
              <SpacingComponent key={g.id + "space"} size={20} />,
            ])}

            <SpacingComponent size={25} />
          </Box>
        </ContentContainer>
      </ScrollContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    friends: state.friends.friends,
    friendRequests: state.friends.friendRequests,
    groupInvitations: state.friends.groupInvitations,
    pendingFriendRequests: state.friends.pendingFriendRequests,
    pendingGroupRequests: state.friends.pendingGroupRequests,
    groups: getGroups(state),
    tabs: state.tabs.tabs,
  };
}

export default connect(mapStateToProps)(Dashboard);
