import React, { Component } from "react"
import styled from "styled-components/native"
import Header from "./Header"
import { ScrollView } from "react-native"
import styles from "../utilities/styles"
import { Platform } from "react-native"
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
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          ref={scroll => {
            this.scrollView = scroll
          }}
        >
          {this.props.children}
        </ScrollView>
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  background-color: ${styles.colors.grey[100]};
  ${Platform.OS !== "ios" && "min-height: 100vh"};
`
