import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

import Button from "../components/Button"

export default class Option extends Component {
  render() {
    const { options } = this.props

    return (
      <Container>
        {options.map(option => (
          <ActionableOption onPress={option.action}>
            <Text color={option.color}>{option.text}</Text>
          </ActionableOption>
        ))}
      </Container>
    )
  }
}

const Container = styled.View`
  align-items: center;
  justify-content: space-between;
  height: 40px;
`

const ActionableOption = styled.TouchableOpacity``

const Text = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.color};
`
