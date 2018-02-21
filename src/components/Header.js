import React, { Component, PureComponent } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import { withRouter } from "react-router"
import { bind } from "decko"
import Spacing from "../components/Spacing"
import VibrancyView from "./VibrancyView"

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

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  constructor(props) {
    super(props)

    this.vibrancyStyle = {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: 200,
    }
  }

  render() {
    const { backText, title, light } = this.props
    return (
      <Bar>
        <VibrancyView
          blurType="light"
          blurAmount={20}
          style={this.vibrancyStyle}
          color={light ? "white" : styles.colors.grey[100]}
          key="vibrancy"
        />
        <Container>
          <Spacing
            size={25}
            // color={light ? "white" : styles.colors.grey[100]}
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
          {/* <Gradient
          colors={
            light
              ? ["white", " rgba(255, 255,255,0)"]
              : [styles.colors.grey[100], "rgba(248, 248, 248, 0)"]
          }
          size={25}
        /> */}
          <Spacing size={20} />
        </Container>
      </Bar>
    )
  }
}

export default withRouter(Header)

const Bar = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  position: absolute;
  background-color: transparent;
`

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
  /* background-color: ${props =>
    props.light ? "white" : styles.colors.grey[100]}; */
`

const Container = styled.View`
  background-color: transparent;
  width: 100%;
  max-width: 1000px;
`

const Title = styled.Text`
  font-weight: 900;
  font-size: 40px;
  letter-spacing: -0.5;
  color: black;
`
