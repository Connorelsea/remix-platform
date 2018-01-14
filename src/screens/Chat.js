import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

export default class Chat extends Component {
  render() {
    return (
      <Container>
        <Text>Chat</Text>
      </Container>
    )
  }
}

const Container = styled.View`
  background-color: blue;
  flex: 1;
`
