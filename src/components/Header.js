import React, { Component, PureComponent } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"
import { withRouter } from "react-router"
import { bind } from "decko"
import Spacing from "../components/Spacing"
import VibrancyView from "./VibrancyView"
import { Motion, spring } from "react-motion"

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
    const { backText, title, light, large } = this.props
    return (
      <Motion
        style={{
          x: spring(large ? 120 : 60),
        }}
      >
        {({ x }) => (
          <Bar height={x}>
            <VibrancyView
              blurType="light"
              blurAmount={20}
              height={x}
              style={this.vibrancyStyle}
              color={
                !large || light
                  ? "rgba(255, 255, 255, 0.8)"
                  : "rgba(241, 240, 247, 0.7)"
              }
              key="vibrancy"
            />
            <Container>
              <Spacing size={large ? 25 : 0} fullwidth={1} />
              <Upper light={light} large={large}>
                {backText !== "remove" && (
                  <Back onPress={this.onBackPress}>
                    <Icon name="arrow-left" size={22} color={backColor} />
                    <Spacing size={5} />
                    <BackText>{backText || "Back"}</BackText>
                  </Back>
                )}
                {!large && <Spacing size={15} />}
                <Title large={large}>{title || "Remix"}</Title>
              </Upper>
            </Container>
          </Bar>
        )}
      </Motion>
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
  height: ${props => props.height};
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
  background-color: transparent;
  padding-right: 25px;
  padding-left: 25px;
  ${props => (!props.large ? "flex-direction: row; align-items: center" : "")};
`

const Container = styled.View`
  background-color: transparent;
  width: 100%;
  max-width: 1000px;
`

const Title = styled.Text`
  font-weight: 900;
  font-size: ${props => (props.large ? 35 : 25)}px;
  letter-spacing: -0.5;
  color: black;
`
