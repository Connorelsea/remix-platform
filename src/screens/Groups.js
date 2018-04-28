import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

export default class Groups extends Component {
  render() {
    return (
      <Container>
        <Text>Groups</Text>
      </Container>
    )
  }
}

const Container = styled.View`
  background-color: green;
  flex: 1;
`
