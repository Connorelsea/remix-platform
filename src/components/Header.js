import React, { Component, PureComponent } from "react"
import styled from "styled-components/native"
import Gradient from "./Gradient"
import styles from "../utilities/styles"
import { withRouter } from "react-router"
import { bind } from "decko"
import Spacing from "../components/Spacing"

import Icon from "react-native-vector-icons/dist/Feather"

const backColor = styles.colors.grey[500]

class Header extends Component {
  @bind
  onBackPress() {
    this.props.history.goBack()
  }

  @bind
  onNewFriendPress() {
    this.props.history.push("/new/friend")
  }

  render() {
    const { backText, title, user, light } = this.props
    return (
      <Container>
        <Spacing
          size={45}
          color={light ? "white" : styles.colors.grey[100]}
          fullwidth={1}
        />
        <Upper light={light}>
          {backText !== "remove" && (
            <Back onPress={this.onBackPress}>
              <Icon name="arrow-left" size={22} color={backColor} />
              <Spacing size={5} />
              <BackText>{backText || "Back"}</BackText>
            </Back>
          )}
          <Title>{title || "Remix"}</Title>
        </Upper>
        <Gradient
          colors={
            light
              ? ["white", " rgba(255, 255,255,0)"]
              : [styles.colors.grey[100], "rgba(248, 248, 248, 0)"]
          }
          size={25}
        />
      </Container>
    )
  }
}

export default withRouter(Header)

const Back = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const BackText = styled.Text`
  color: ${backColor};
  font-size: 16px;
  font-weight: 500;
`

const Upper = styled.View`
  background-color: ${props =>
    props.light ? "white" : styles.colors.grey[100]};
  padding-left: 15px;
  padding-right: 15px;
`

const Container = styled.View`
  background-color: transparent;
  width: 100%;
  position: absolute;
  z-index: 9999;
`

const Title = styled.Text`
  font-weight: 900;
  font-size: 40px;
  letter-spacing: -0.5;
  color: black;
`
