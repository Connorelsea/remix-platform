import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

export default class Chats extends Component {
  render() {
    return (
      <Container>
        <Text>Chats</Text>
      </Container>
    )
  }
}

const Container = styled.View`
  background-color: red;
  flex: 1;
`
