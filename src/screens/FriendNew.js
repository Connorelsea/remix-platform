import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import AppScrollContainer from "../components/AppScrollContainer"
import { query, mutate } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

import Button from "../components/Button"
import Input from "../components/Input"
import Option from "../components/Option"
import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import * as Animatable from "react-native-animatable"

class FriendNew extends Component {
  async onPress({ message, fromUserId, toUserId }) {
    const req = await mutate(
      `mutation($message: String, $fromUserId: ID!, $toUserId: ID!) {
        createFriendRequest(message: $message, fromUserId: $fromUserId, toUserId: $toUserId)
      }`,
      { message, fromUserId, toUserId }
    )
    console.log(req)
  }

  state = {
    phrase: undefined,
    results: undefined,
  }

  @bind
  onChangeText(text) {
    this.setState({
      phrase: text,
    })
  }

  @bind
  async onSearch() {
    const { phrase } = this.state

    const results = await query(
      `query($phrase: String!) {
        users(phrase: $phrase) { id, name, username, description }
      }`,
      { phrase }
    )

    this.setState({
      results,
    })
  }

  @bind
  addFriendFunc(id, message = "") {
    const { user } = this.props
    return () => this.onPress({ toUserId: id, message, fromUserId: user.id })
  }

  render() {
    const { user } = this.props
    const { phrase, results } = this.state

    return (
      <AppScrollContainer user={user} title="New Friend">
        <SearchContainer>
          <Input onChangeText={this.onChangeText} value={phrase} />
          <Spacing size={15} />
          <Button onPress={this.onSearch} title="Search" />
        </SearchContainer>

        {results && (
          <ResultContainer>
            {results.data.users.map(user => (
              <UserCard
                key={user.id}
                {...user}
                addFriendFunc={this.addFriendFunc}
              />
            ))}
          </ResultContainer>
        )}
      </AppScrollContainer>
    )
  }
}

const Card = styled.View`
  background-color: white;
  padding: 16px 18px;
  border-radius: 8px;
  shadow-color: black;
  shadow-radius: 8px;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.09;
  margin-bottom: 20px;
`

const Name = styled.Text`
  font-size: 24px;
  color: black;
  font-weight: 900;
  letter-spacing: -0.5px;
  flex: 1;
`

const Bio = styled.Text`
  font-size: 16px;
  color: ${styles.colors.grey[400]};
`

// const options = [
//   { text: "Profile", action: () => {}, color: styles.colors.grey[400] },
//   { text: "Add Friend", action: () => {}, color: "black" },
// ]

const UserCard = ({ id, name, username, description, addFriendFunc }) => (
  <Card animation="fadeInUp" delay={200}>
    <Body>
      <Image
        source={{
          uri: "https://www.arete.net/Content/Images/nopic.jpg",
        }}
      />
      <Spacing size={15} />
      <Header>
        <Text tier="title">{name}</Text>
        <Text tier="subtitle">@{username}</Text>
        <Spacing size={10} />
        <Text tier="body">{description}</Text>
      </Header>
    </Body>
    <Spacing size={10} />
    <Actions>
      <Button small onPress={() => {}} title="Profile" />
      <Spacing size={15} />
      <Button small onPress={addFriendFunc(id)} title="Add Friend" />
    </Actions>
  </Card>
)

const Image = styled.Image`
  height: 85px;
  width: 85px;
  border-radius: 43;
  overflow: hidden;
`

const Header = styled.View``

const Body = styled.View`
  flex-direction: row;
`

const Actions = styled.View`
  margin-top: 15px;
  flex: 1;
  flex-direction: row;
`

const ResultContainer = styled.View`
  flex: 1;
`

const SearchContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`

export default FriendNew
