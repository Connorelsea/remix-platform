import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
import { withRouter } from "react-router"
import styles from "../utilities/styles"
import { bind } from "decko"

const Route = Routing.Route
const Link = Routing.Link
class Button extends Component {
  @bind
  onLinkPress() {
    this.props.history.push(this.props.to)
  }
  render() {
    const { onPress, to, title } = this.props

    return (
      <Opacity
        small={this.props.small}
        onPress={to === undefined ? this.props.onPress : this.onLinkPress}
      >
        <Text small={this.props.small}>{this.props.title}</Text>
      </Opacity>
    )
  }
}

export default withRouter(Button)

const StyledLink = styled(Link)`
  padding: 15px;
  background-color: ${styles.colors.grey[200]};
  border: 1px ${styles.colors.grey[200]};
  overflow: hidden;
  border-radius: 10px;
  display: block;
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
