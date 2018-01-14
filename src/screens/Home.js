import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import AppScrollContainer from "../components/AppScrollContainer"
import Button from "../components/Button"

export default class Home extends Component {
  render() {
    return (
      <AppScrollContainer backText="remove">
        <Button to="/login" title="Login" />
        <Button to="/create" title="Create New User" />
      </AppScrollContainer>
    )
  }
}
