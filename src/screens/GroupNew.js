import React, { Component } from "react"
import styled from "styled-components/native"
import AppScrollContainer from "../components/AppScrollContainer"
import { query, mutate } from "../utilities/gql_util"

import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import Button from "../components/Button"
import Input from "../components/Input"

import { bind } from "decko"
import HelpCard from "../components/HelpCard"
import Icon from "react-native-vector-icons/dist/Feather"
class GroupCreate extends Component {
  state = {
    phrase: undefined,
    results: undefined,
  }

  @bind
  async onSearch() {
    const { phrase } = this.state

    const results = await query(
      `query($phrase: String!) {
        users(phrase: $phrase) { id, name, username, description, iconUrl }
      }`,
      { phrase }
    )

    this.setState({
      results,
    })
  }

  render() {
    const { user } = this.props
    const { phrase, results } = this.state

    // TODO: Make group search work

    const resultComp = results && (
      <ResultContainer>
        {results.data.users.map(user => (
          <GroupCard key={user.id} addFriendFunc={this.addFriendFunc} />
        ))}
      </ResultContainer>
    )

    const searchComp = (
      <SearchContainer>
        <Input
          onChangeText={this.onChangeText}
          value={phrase}
          placeholder="Search for Groups"
        />
        <Spacing size={15} />
        <Button
          onPress={this.onSearch}
          title="Search"
          icon={<Icon name="search" size={25} />}
        />
      </SearchContainer>
    )

    const helpComps = [
      <HelpCard title="Search for existing groups or create your own" />,
      <Button
        to="/new/group/create"
        title="Create New Group"
        icon={<Icon name="users" size={25} />}
      />,
    ]

    return (
      <AppScrollContainer user={user} title="New Group">
        {[searchComp, resultComp, ...helpComps]}
      </AppScrollContainer>
    )
  }
}

export default GroupCreate

const GroupCard = ({}) => (
  <Card>
    <Text tier="title">Hello</Text>
  </Card>
)

const Card = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  shadow-color: black;
  shadow-radius: 22px;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.09;
  margin-bottom: 20px;
`

const SearchContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`

const ResultContainer = styled.View`
  flex: 1;
`
