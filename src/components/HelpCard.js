import React, { Component } from "react"
import styles from "../utilities/styles"
import styled from "styled-components/native"
import { bind } from "decko"
import Text from "../components/Text"

class HelpCard extends Component {
  render() {
    const { title } = this.props
    return (
      <Container>
        <Text tier="emphasis" center>
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
