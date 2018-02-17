import React, { Component } from "react"
import styled from "styled-components"
import Header from "./Header"
import styles from "../utilities/styles"
import Spacing from "./Spacing"

export default class AppScrollContainer extends Component {
  render() {
    const { user } = this.props
    return (
      <Container>
        <Header
          user={user}
          backText={this.props.backText || "Back"}
          title={this.props.title || "Remix"}
        />
        <Spacing size={120} />
        <PaddingContainer>
          <Scroll>{this.props.children}</Scroll>
        </PaddingContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${styles.colors.grey[100]};
  height: 100vh;
  width: 100%;
  overflow: scroll;
  overflow-x: hidden;
`

const PaddingContainer = styled.div`
  padding: 25px;
  align-self: center;
`

const Scroll = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 1000px;
  flex-direction: column;
  align-self: center;
`
