import React, { Component } from "react"
import { View, Text } from "react-native"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import LinearGradient from "react-native-linear-gradient"

import styles from "../utilities/styles"

import { withRouter } from "react-router"

import { bind } from "decko"

class Header extends Component {
  @bind
  onBackPress() {
    this.props.history.goBack()
  }

  render() {
    const { backText, title } = this.props
    return (
      <Container>
        <Upper>
          {backText !== "remove" && (
            <Back onPress={this.onBackPress}>
              <BackText>{backText || "Back"}</BackText>
            </Back>
          )}
          <Title>{title || "Remix"}</Title>
        </Upper>
        <LinearGradient
          colors={[styles.colors.grey[100], "rgba(248, 248, 248, 0)"]}
          style={{ height: 40, width: "100%" }}
        />
      </Container>
    )
  }
}

export default withRouter(Header)

const Upper = styled.View`
  background-color: ${styles.colors.grey[100]};
  padding-top: 35px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  flex: 1;
  justify-content: flex-end;
`

const Container = styled.View`
  background-color: transparent;
  width: 100%;
  height: 140px;
  position: absolute;
  z-index: 9999;
`

const Title = styled.Text`
  font-weight: 900;
  font-size: 40px;
  letter-spacing: -0.5;
  color: black;
`

const Back = styled.TouchableOpacity``

const BackText = styled.Text`
  color: gray;
  font-size: 16px;
  font-weight: 500;
`
