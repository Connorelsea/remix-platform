import React, { Component } from "react"
import styled from "styled-components/native"

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

import Button from "../components/Button"
import Spacing from "../components/Spacing"
import FriendRequest from "../components/FriendRequest"
import GroupCard from "../components/GroupCard"
import gql from "graphql-tag"

import Icon from "react-native-vector-icons/dist/Feather"
import HelpCard from "../components/HelpCard"

import { connect } from "react-redux"

import User from "../ducks/user"

class Dashboard extends Component {
  @bind
  fire() {
    query(
      `
      { User(id: ${this.props.user.id}) { groups { id } } }
    `
    ).then(data => console.log("got user", data))
  }

  async testSubscription() {
    const { user: { id } } = this.props

    const observable = await client.subscribe({
      query: gql`
        subscription newFriendRequest {
          newFriendRequest(toUserId: ${id}) {
            toUser {
              id
            }
            message
          }
        }
      `,
    })

    const subscription = await observable.subscribe(response => {
      console.log("SUBSCRIPTION RESPONSE", response)
    })

    // console.log("subscription")
    // console.log(observable)
  }

  @bind
  async getFriendRequests() {
    const { user: { id } } = this.props
    const requests = await query(`
      {
        User(id: ${id}) {
          id
          friends {
            id
          }
          friendRequests {
            id
            createdAt
            toUser { name, id }
            fromUser { name, id }
          }
        }
      }
    `)

    this.setState({
      friendRequests: requests.data.User.friendRequests,
      friends: requests.data.User.friends,
    })
  }

  @bind
  async getGroups() {
    const { user: { id } } = this.props
    const response = await query(`
      {
        User(id: ${id}) {
          id
          groups {
            id
            iconUrl
            name
            description
          }
        }
      }
    `)

    console.log("GROUP RESPONSE")
    console.log(response)

    this.setState({ groups: response.data.User.groups })
  }

  state = {
    friendRequests: [],
    friends: [],
    groups: [],
  }

  componentDidMount() {
    // this.getFriendRequests()
    // this.getGroups()
    // this.testSubscription()
    const {
      user: { id },
      loadInitialUser,
      subscribeToFriendRequests,
      subscribeToMessages,
    } = this.props

    loadInitialUser(id)
    subscribeToFriendRequests(id)
    subscribeToMessages(id)
  }

  render() {
    const {
      user,
      reduxUser,
      friendRequests,
      groups,
      removeFriendRequest,
    } = this.props

    return (
      <AppScrollContainer user={user} backText="remove" title="Remix">
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
          <GroupCard key={group.id} group={group} user={user} />
        ))}
        {groups.length === 0 && (
          <HelpCard title="Add some friends or join some groups to start chatting" />
        )}
        {/* <HelpCard title={JSON.stringify(reduxUser)} /> */}
      </AppScrollContainer>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToFriendRequests: id => {
      dispatch(User.creators.subscribeToFriendRequests(id))
    },
    subscribeToMessages: id => {
      dispatch(User.creators.subscribeToMessages(id))
    },
    loadInitialUser: id => dispatch(User.creators.loadInitialUser(id)),
    removeFriendRequest: id => dispatch(User.creators.removeFriendRequest(id)),
  }
}

function mapStateToProps(state) {
  return {
    reduxUser: state.user,
    friendRequests: state.user.friendRequests,
    groups: state.user.groups,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

const ActionContainer = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`

const Container = styled.View`
  flex: 1;
`
