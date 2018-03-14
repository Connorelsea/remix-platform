import React from "react"
import { connect } from "react-redux"
import { ThemeProvider } from "styled-components"
import { themeSelector } from "../ducks/app"

class ThemeManager extends React.Component {
  render() {
    const { children, theme } = this.props
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
  }
}

function mapStateToProps(state) {
  return {
    theme: themeSelector(state),
  }
}

export default connect(mapStateToProps)(ThemeManager)
