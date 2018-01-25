import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"

import { bind } from "decko"

import Button from "../components/Button"
import styles from "../utilities/styles"

const Route = Routing.Route
const Link = Routing.Link

export default class Input extends Component {
  render() {
    const { user, onChangeText, value, placeholder } = this.props

    return (
      <StyledInput
        placeholder={placeholder}
        placeholderTextColor={styles.colors.grey[200]}
        value={value}
        onChangeText={onChangeText}
      />
    )
  }
}

const StyledInput = styled.TextInput`
  border: 1px solid ${styles.colors.grey[200]};
  border-radius: 100px;
  margin: 0px;
  padding: 15px;
  font-size: 17px;
  background-color: white;
`
