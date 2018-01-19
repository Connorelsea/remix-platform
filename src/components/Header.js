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

  @bind
  onNewFriendPress() {
    this.props.history.push("/new/friend")
  }

  render() {
    const { backText, title, user } = this.props
    return (
      <Container>
        <Spacing height={50} />
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
          style={{ height: 25, width: "100%" }}
        />
      </Container>
    )
  }
}

export default withRouter(Header)

const Spacing = styled.View`
  height: ${props => props.height}px;
  width: 100%;
  background-color: ${styles.colors.grey[100]};
`

const Upper = styled.View`
  background-color: ${styles.colors.grey[100]};
  padding-left: 15px;
  padding-right: 15px;
`

// const Actions = styled.View`
//   padding: 0 15px;
//   flex-direction: row;
//   background-color: ${styles.colors.grey[100]};
// `

// const ActionButton = styled.TouchableOpacity`
//   background-color: ${styles.colors.grey[200]};
//   padding: 10px 10px;
//   overflow: hidden;
//   border-radius: 6px;
//   margin-right: 10px;
// `

// const ActionText = styled.Text`
//   font-size: 15px;
//   font-weight: 600;
// `

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

const Back = styled.TouchableOpacity``

const BackText = styled.Text`
  color: gray;
  font-size: 16px;
  font-weight: 500;
`
