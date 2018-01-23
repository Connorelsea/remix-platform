import React, { Component } from "react"
import AppScrollContainer from "../components/AppScrollContainer"
import Button from "../components/Button"
import Spacing from "../components/Spacing"

export default class Home extends Component {
  render() {
    return (
      <AppScrollContainer backText="remove">
        <Button to="/login" title="Login" />
        <Spacing size={15} />
        <Button to="/create" title="Create New User" />
      </AppScrollContainer>
    )
  }
}
