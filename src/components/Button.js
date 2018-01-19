import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"

import styles from "../utilities/styles"

const Route = Routing.Route
const Link = Routing.Link
export default class Button extends Component {
  render() {
    const { onPress, to, title } = this.props
    if (to !== undefined)
      return (
        <StyledLink to={to}>
          <Text>{this.props.title}</Text>
        </StyledLink>
      )
    return (
      <Opacity small={this.props.small} onPress={this.props.onPress}>
        <Text small={this.props.small}>{this.props.title}</Text>
      </Opacity>
    )
  }
}

const StyledLink = styled(Link)`
  padding: 15px;
  background-color: ${styles.colors.grey[200]};
  border: 1px ${styles.colors.grey[200]};
  overflow: hidden;
  border-radius: 10px;
`

const Opacity = styled.TouchableOpacity`
  padding: ${({ small }) => (small ? 10 : 15)}px 15px;
  background-color: ${styles.colors.grey[200]};
  overflow: hidden;
  border-radius: 10px;
`

const Text = styled.Text`
  color: black;
  font-weight: 700;
  font-size: ${props => (props.small ? 15 : 17)}px;
  letter-spacing: -0.3px;
  text-align: center;
`
