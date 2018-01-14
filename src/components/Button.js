import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
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
      <Opacity onPress={this.props.onPress}>
        <Text>{this.props.title}</Text>
      </Opacity>
    )
  }
}

const StyledLink = styled(Link)`
  padding: 15px;
  background-color: #0096e7;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 10px;
`

const Opacity = styled.TouchableOpacity`
  padding: 15px;
  background-color: #0096e7;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 10px;
`

const Text = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.3px;
  text-align: center;
`
