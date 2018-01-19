import React, { Component } from "react"
import LinearGradient from "react-native-linear-gradient"

export default class Gradient extends Component {
  render() {
    const { colors, size } = this.props
    return (
      <LinearGradient colors={colors} style={{ height: size, width: "100%" }}>
        {this.props.children}
      </LinearGradient>
    )
  }
}
