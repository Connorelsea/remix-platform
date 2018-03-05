import React, { Component } from "react"
import styled from "styled-components/native"
import { withRouter } from "react-router"
import styles from "../utilities/styles"
import { bind } from "decko"
import Spacing from "./Spacing"

class Button extends Component {
  @bind
  onLinkPress() {
    this.props.history.push(this.props.to)
  }

  render() {
    const { onPress, to, title, icon, small, disabled } = this.props

    // const clonedIcon = React.cloneElement(icon, { key: "icon", ...icon })

    let props = {}

    if (disabled)
      props = {
        small,
        disabled: true,
      }
    else
      props = {
        onPress: to === undefined ? onPress : this.onLinkPress,
        small,
      }

    return (
      <Opacity {...props}>
        <Inner>
          <Text small={small}>{title}</Text>
          {icon && [<Spacing key="spacing" size={10} />, icon]}
        </Inner>
      </Opacity>
    )
  }
}

export default withRouter(Button)

const Inner = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Opacity = styled.TouchableOpacity`
  padding: ${({ small }) => (small ? "8px 15px" : "12px 17px")};
  background-color: ${({ disabled }) =>
    styles.colors.grey[disabled ? 400 : 200]};
  overflow: hidden;
  border-radius: ${({ small }) => (small ? 20 : 50)}px;
  align-items: center;
  justify-content: center;
  ${props => (props.disabled ? "cursor: not-allowed" : undefined)};
`

const Text = styled.Text`
  color: ${props =>
    props.small ? styles.colors.grey[600] : styles.colors.grey[600]};
  font-weight: ${props => (props.small ? 500 : 600)};
  font-size: ${props => (props.small ? 14 : 17)}px;
  letter-spacing: -0.3px;
  text-align: center;
`
