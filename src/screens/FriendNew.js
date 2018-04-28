import React, { Component } from "react"
import styled from "styled-components"
import AppScrollContainer from "../components/AppScrollContainer"
import { query, mutate } from "../utilities/gql_util"
import { bind } from "decko"
import Button from "../components/Button"
import Input from "../components/Input"
import styles from "../utilities/styles"
import Text from "../components/Text"
import Spacing from "../components/Spacing"
import HelpCard from "../components/HelpCard"
import Card from "../components/Card"
import Icon from "react-native-vector-icons/dist/Feather"
import { connect } from "react-redux"

class FriendNew extends Component {
  async onPress({ message, fromUserId, toUserId }) {
    const req = await mutate(
      `mutation($message: String, $fromUserId: ID!, $toUserId: ID!) {
        createFriendRequest(message: $message, fromUserId: $fromUserId, toUserId: $toUserId) {
          id
        }
      }`,
      { message, fromUserId, toUserId }
    )
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
        users(phrase: $phrase) { id, name, username, description, iconUrl }
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
          <Button
            onPress={this.onSearch}
            title="Search"
            icon={<Icon name="search" size={25} />}
          />
        </SearchContainer>

        {results ? (
          <ResultContainer>
            {results.data.users.map(user => (
              <UserCard
                key={user.id}
                {...user}
                addFriendFunc={this.addFriendFunc}
              />
            ))}
          </ResultContainer>
        ) : (
          <HelpCard title="Search for friends by their name or username" />
        )}
      </AppScrollContainer>
    )
  }
}

const UserCard = ({
  id,
  name,
  username,
  description,
  iconUrl,
  addFriendFunc,
}) => (
  <Card animation="fadeInUp" delay={200}>
    <Body>
      <Image
        source={{
          uri: iconUrl || "https://www.arete.net/Content/Images/nopic.jpg",
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

const imageSize = 90

const Image = styled.Image`
  height: ${imageSize}px;
  width: ${imageSize}px;
  border-radius: ${imageSize / 2};
  background-color: ${styles.colors.grey[100]};
  overflow: hidden;
`

const Header = styled.View``

const Body = styled.View`
  flex-direction: row;
`

const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`

const ResultContainer = styled.View`
  flex: 1;
`

const SearchContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`

function mapDispatchToProps(dispatch) {
  return {}
}

function mapStateToProps(state, props) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendNew)
