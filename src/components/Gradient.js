import React, { Component } from "react"
import styled from "styled-components/native"

export default class Gradient extends Component {
  render() {
    const { colors, size } = this.props
    return (
      <Grad
        size={size}
        style={{
          background: `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`,
        }}
      >
        {this.props.children}
      </Grad>
    )
  }
}

const Grad = styled.View`
  height: ${props => props.size}px;
  width: 100%;
`
