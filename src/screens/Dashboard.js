import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

export default class Dashboard extends Component {
  @bind
  fire() {
    query(
      client,
      `
      { User(id: ${this.props.user.id}) { groups { id } } }
    `
    ).then(data => console.log("got user", data))
  }

  render() {
    const { user } = this.props

    return (
      <AppScrollContainer user={user} backText="remove" title="Remix">
        <Text>Hello dashboard</Text>
        <Button onPress={this.fire}>
          <Text>FIREEEE</Text>
        </Button>
      </AppScrollContainer>
    )
  }
}

const Container = styled.View`
  flex: 1;
`

const Button = styled.TouchableOpacity``
