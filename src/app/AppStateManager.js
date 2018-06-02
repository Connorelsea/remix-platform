import React, { Component, type Children } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { themeSelector } from "../ducks/app";
import { GlobalState } from "../reducers/rootReducer";
import { ApolloProvider } from "react-apollo";

class AppStateManager extends React.Component {
  render() {
    const { children, theme, apolloClient } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </ThemeProvider>
    );
  }
}

function mapStateToProps(state: GlobalState) {
  console.log("SELECTED THEME", themeSelector(state));
  return {
    theme: themeSelector(state),
    apolloClient: state.auth.apolloClient,
  };
}

export default connect(mapStateToProps)(AppStateManager);
