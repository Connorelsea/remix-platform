// @flow

import React, { Component, Fragment, type Node } from "react";
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
import { type FriendRequest } from "../../types/friendRequest";
import Notification from "../../components/Notification";
import SelfUserDisplayCard from "./SelfUserDisplayCard";

type Props = {
  friends: Array<User>,
  groups: Array<Group>,
  tabs: Array<Tab>,
  friendRequests: Array<FriendRequest>,
  groupInvitations: Array<any>,
};

class Dashboard extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (this.props.friends.toString() !== nextProps.friends.toString())
      return true;

    if (this.props.groups.toString() !== nextProps.groups.toString())
      return true;

    if (this.props.tabs.toString() !== nextProps.tabs.toString()) return true;

    if (
      this.props.friendRequests.toString() !==
      nextProps.friendRequests.toString()
    )
      return true;

    if (
      this.props.groupInvitations.toString() !==
      nextProps.groupInvitations.toString()
    )
      return true;

    return false;
  }

  render(): Node {
    const { friends } = this.props;
    const friendIds = friends.map(f => f.id);

    return <ProvideUsers userIds={[...friendIds]} render={this.renderBody} />;
  }

  @bind
  renderBody(bodyProps: ProvideUsersRenderProps): Node {
    const { users, usersLoading } = bodyProps;
    const {
      friends,
      groups,
      friendRequests,
      groupInvitations,
      shouldShowProfilePicNotif,
      shouldShowEditProfileNotif,
    } = this.props;

    if (usersLoading) return "loading users";

    return (
      <ScrollContainer>
        <ContentContainer>
          <Box column padding="25px" fullWidth>
            <TabControls />
            <SpacingComponent size={20} />
            <Subtitle>Notifications</Subtitle>
            <SpacingComponent size={15} />
            {shouldShowProfilePicNotif && (
              <Fragment>
                <Notification
                  type="ONBOARDING"
                  title="Upload a profile picture"
                  acceptText="Continue"
                  denyText="Later"
                  createdAt={new Date()}
                />
                <SpacingComponent size={15} />
              </Fragment>
            )}
            {friendRequests.map(fr => (
              <Fragment>
                <Notification
                  fromUser={fr.fromUser}
                  type="FRIEND_REQUEST"
                  createdAt={fr.createdAt}
                />
                <SpacingComponent size={15} />
              </Fragment>
            ))}
            {groupInvitations.map(fr => (
              <Fragment>
                <Notification
                  fromUser={fr.fromUser}
                  forGroup={fr.forGroup}
                  type="GROUP_INVITATION"
                  createdAt={fr.createdAt}
                />
                <SpacingComponent size={15} />
              </Fragment>
            ))}
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
            <SelfUserDisplayCard />
            <SpacingComponent size={20} />
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
    shouldShowProfilePicNotif: state.onboarding.shouldShowProfilePicNotif,
    shouldShowEditProfileNotif: state.onboarding.shouldShowEditProfileNotif,
  };
}

export default connect(mapStateToProps)(Dashboard);
