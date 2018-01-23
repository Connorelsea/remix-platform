import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
import { withRouter } from "react-router"
import styles from "../utilities/styles"
import { bind } from "decko"
import Spacing from "./Spacing"

const Route = Routing.Route
const Link = Routing.Link
class Button extends Component {
  @bind
  onLinkPress() {
    this.props.history.push(this.props.to)
  }
  render() {
    const { onPress, to, title, icon } = this.props

    return (
      <Opacity
        small={this.props.small}
        onPress={to === undefined ? this.props.onPress : this.onLinkPress}
      >
        <Inner>
          <Text small={this.props.small}>{this.props.title}</Text>
          {icon && [<Spacing size={10} />, icon]}
        </Inner>
      </Opacity>
    )
  }
}

export default withRouter(Button)

const Inner = styled.View`
  flex-direction: row;
  align-items: center;
`

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
  background-color: ${({ small }) => styles.colors.grey[small ? 100 : 200]};
  overflow: hidden;
  border-radius: ${({ small }) => (small ? 20 : 10)}px;
`

const Text = styled.Text`
  color: ${props =>
    props.small ? styles.colors.grey[500] : styles.colors.grey[700]};
  font-weight: ${props => (props.small ? 500 : 500)};
  font-size: ${props => (props.small ? 14 : 17)}px;
  letter-spacing: -0.3px;
  text-align: center;
`
