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

    return (
      <AppScrollContainer user={user} title="New Group">
        <SearchContainer>
          <Input onChangeText={this.onChangeText} value={phrase} />
          <Spacing size={15} />
          <Button onPress={this.onSearch} title="Search" />
        </SearchContainer>

        {results ? (
          <ResultContainer>
            {results.data.users.map(user => (
              <GroupCard
                key={user.id}
                {...user}
                addFriendFunc={this.addFriendFunc}
              />
            ))}
          </ResultContainer>
        ) : (
          <HelpCard title="Search for groups or create your own. A group can be for anyone and anything - your classmates in a college course, your closest friends, or a group of strangers bound by common interests" />
        )}
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
