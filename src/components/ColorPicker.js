import React, { Component } from "react"
import { withRouter } from "react-router"
import styled from "styled-components/native"
import { bind } from "decko"
import { TouchableOpacity } from "react-native"
import styles from "../utilities/styles"
import Card from "../components/Card"
import Spacing from "./Spacing"
import fontColorContrast from "font-color-contrast"

class ColorPicker extends Component {
  state = {
    oldColors: [
      "#5A5E64",
      "#D1D5DB",
      "#FFC0C0",
      "#C94343",

      "#801D1D",
      "#F39D05",
      "#F4D701",
      "#32D561",
      "#154B25",

      "#0f72e0",
      "#9DC7F8",
      "#644F99",
    ],
    colors: [
      "#D1D5DB",
      "#FFCACA",
      "#FF8383",
      "#B42525",
      "#FFC000",
      "#72B925",
      "#89C1FF",
      "#0F72E0",
      "#1D297F",
      "#752F95",
    ],
    selectedIndex: 0,
  }

  @bind
  onSelectIndex(i) {
    return () => {
      this.setState({ selectedIndex: i })
      this.props.onColorChange(this.state.colors[i])
    }
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
  max-width: 540px;
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
  transition: border 0.5s;
`

const Text = styled.Text`
  color: ${({ color }) => color};
  font-size: 35px;
  text-align: center;
  font-weight: 200;
  padding-top: 15px;
`
