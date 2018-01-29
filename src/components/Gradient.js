import React, { Component } from "react"
import LinearGradient from "./LinearGradient"

export default class Gradient extends Component {
  render() {
    const { colors, size } = this.props
    return (
      <LinearGradient
        colors={colors}
        style={{ height: size, width: "100%" }}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.2, y: 0.1 }}
      >
        {this.props.children}
      </LinearGradient>
    )
  }
}
