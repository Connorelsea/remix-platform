import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

export default class UserCreate extends Component {
  render() {
    return (
      <Container>
        <Text>Done creating your user.</Text>
      </Container>
    )
  }
}

const Container = styled.View``

const Text = styled.Text``
