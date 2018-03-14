import React, { Component } from "react"
import { withRouter } from "react-router"
import styled from "styled-components/native"
import { bind } from "decko"
import { TouchableOpacity } from "react-native"
import styles from "../utilities/styles"
import Card from "../components/Card"
import Spacing from "./Spacing"
import fontColorContrast from "font-color-contrast"
import colors from "../utilities/colors"

class ColorPicker extends Component {
  state = {
    colors,
    selectedIndex: 0,
  }

  @bind
  onSelectIndex(i) {
    return () => {
      this.setState({ selectedIndex: i })
      this.props.onColorChange(this.state.colors[i])
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.selectedIndex !== nextState.selectedIndex) {
      console.log("UPDATING")
      return true
    }

    console.log("NOT UPDATING")

    return false
  }

  render() {
    const { colors, selectedIndex } = this.state

    return (
      <Container>
        {colors.map((c, i) => {
          const textColor = fontColorContrast(c) // === "#000000" ? "#FFFFFF" : "#000000"

          return (
            <TouchableOpacity onPress={this.onSelectIndex(i)}>
              <Color key={c} color={c} isSelected={selectedIndex === i}>
                <Text color={textColor}>A</Text>
              </Color>
            </TouchableOpacity>
          )
        })}
      </Container>
    )
  }
}

export default ColorPicker

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  /* max-width: 540px; */
  max-width: 1000px;
  align-self: center;
`

const colorSize = 90

const Color = styled.View`
  height: ${colorSize}px;
  width: ${colorSize}px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 15px;
  border: 7px solid
    ${({ isSelected }) =>
      isSelected ? styles.colors.grey[200] : styles.colors.grey[100]};
  /* transition: border 0.5s; */
`

const Text = styled.Text`
  color: ${({ color }) => color};
  font-size: 35px;
  text-align: center;
  font-weight: 200;
  padding-top: 15px;
`
