import React, { Component } from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

import Button from "../components/Button"
import Text from "../components/Text"
import styles from "../utilities/styles"
import Spacing from "../components/Spacing"
import Option from "../components/Option"

import distanceInWords from "date-fns/distance_in_words"

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
        <Flex row mb={15}>
          <Button to="/new/friend" title="New Friend" />
          <Spacing size={15} />
          <Button to="/new/group" title="New Group" />
        </Flex>
        {friendRequests.map(r => (
          <FriendRequest>
            <Flex jc="space-around">
              <Text tier="requestTitle">
                {r.fromUser.name} <Middle>sent a</Middle> Friend Request
              </Text>
              <Text tier="requestSubtitle">
                {distanceInWords(new Date(r.createdAt), new Date())} ago
              </Text>
            </Flex>
            <Option
              options={[
                { text: "Accept", color: "black", action: () => {} },
                { text: "Deny", color: "rgba(0,0,0,0.5)", action: () => {} },
              ]}
            />
          </FriendRequest>
        ))}
      </AppScrollContainer>
    )
  }
}

const Flex = styled.View`
  flex-direction: ${props => (props.row ? "row" : "column")};
  margin-bottom: ${props => props.mb || 0}px;
  flex: 1;
  justify-content: ${props => props.jc || "flex-start"};
`

const FriendRequest = styled.View`
  padding: 15px;
  background-color: ${styles.colors.grey[200]};
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`

const Middle = styled.Text`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
`

const Container = styled.View`
  flex: 1;
`
