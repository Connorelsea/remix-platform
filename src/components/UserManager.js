import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import gql from "graphql-tag"
import { query, mutate } from "./utilities/gql_util"

import { client } from "./utilities/apollo"

export default class UserManager extends Component {
  componentDidMount() {
    mutate(`
      mutation {
        
      }
    `)
  }
  render() {}
}

const Container = styled.View`
  background-color: green;
  flex: 1;
`
