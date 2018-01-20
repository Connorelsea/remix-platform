import React, { Component } from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

import Button from "../components/Button"
import Text from "../components/Text"
import styles from "../utilities/styles"
import Spacing from "../components/Spacing"
import Option from "../components/Option"
import FriendRequest from "../components/FriendRequest"

const Route = Routing.Route
const Link = Routing.Link

export default class Dashboard extends Component {
  @bind
  fire() {
    query(
      `
      { User(id: ${this.props.user.id}) { groups { id } } }
    `
    ).then(data => console.log("got user", data))
  }

  @bind
  async getFriendRequests() {
    const { user: { id } } = this.props
    const requests = await query(`
      {
        User(id: ${id}) {
          id
          friendRequests {
            id
            createdAt
            toUser { name, id }
            fromUser { name, id }
          }
        }
      }
    `)

    this.setState({ friendRequests: requests.data.User.friendRequests })
  }

  state = {
    friendRequests: [],
  }

  componentDidMount() {
    this.getFriendRequests()
  }

  render() {
    const { user } = this.props
    const { friendRequests } = this.state

    console.log(friendRequests)

    return (
      <AppScrollContainer user={user} backText="remove" title="Remix">
        <ActionContainer>
          <Button to="/new/friend" title="New Friend" />
          <Spacing size={15} />
          <Button to="/new/group" title="New Group" />
        </ActionContainer>
        {friendRequests.map(r => <FriendRequest {...r} />)}
      </AppScrollContainer>
    )
  }
}

const ActionContainer = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`

const Container = styled.View`
  flex: 1;
`
