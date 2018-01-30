import React, { Component } from "react"
import LinearGradient from "./LinearGradient"

export default class Gradient extends Component {
  render() {
    const { colors, size, style } = this.props
    return (
      <LinearGradient
        colors={colors}
        style={{ height: size, width: "100%", ...style }}
        end={{ x: 0.0, y: 0.25 }}
        start={{ x: 0.5, y: 1.0 }}
      >
        {this.props.children}
      </LinearGradient>
    )
  }
}
