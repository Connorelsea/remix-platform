import React, { Component } from "react"
import styled from "styled-components/native"
import Text from "../components/Text"

class HelpCard extends Component {
  render() {
    const { title } = this.props
    return (
      <Container>
        <Text tier="emphasis" center={1}>
          {title}
        </Text>
      </Container>
    )
  }
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 100px;
`

export default HelpCard
