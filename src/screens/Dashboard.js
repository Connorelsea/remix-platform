import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components/native"
import AppScrollContainer from "../components/AppScrollContainer"
import Button from "../components/Button"
import Spacing from "../components/Spacing"
import FriendRequest from "../components/FriendRequest"
import GroupCard from "../components/GroupCard"
import Icon from "react-native-vector-icons/dist/Feather"
import HelpCard from "../components/HelpCard"

class Dashboard extends Component {
  render() {
    const {
      reduxUser,
      friendRequests,
      groups,
      removeFriendRequest,
    } = this.props

    return (
      <AppScrollContainer user={reduxUser} backText="remove" title="Remix">
        <ActionContainer>
          <Button
            to="/new/friend"
            title="New Friend"
            icon={<Icon name="user-plus" size={25} />}
          />
          <Spacing size={15} />
          <Button
            to="/new/group"
            title="New Group"
            icon={<Icon name="users" size={25} />}
          />
        </ActionContainer>
        {friendRequests.map(r => (
          <FriendRequest
            key={r.id}
            {...r}
            removeFriendRequest={removeFriendRequest}
          />
        ))}
        {groups.map(group => (
          <GroupCard key={group.id} group={group} user={reduxUser} />
        ))}
        {groups.length === 0 && (
          <HelpCard title="Add some friends or join some groups to start chatting" />
        )}
      </AppScrollContainer>
    )
  }
}

function mapStateToProps(state) {
  return {
    reduxUser: state.user,
    friendRequests: state.user.friendRequests,
    groups: state.user.groups,
  }
}

export default connect(mapStateToProps, undefined)(Dashboard)

const ActionContainer = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`
