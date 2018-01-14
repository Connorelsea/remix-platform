import React from "react"
import { Provider } from "react-redux"
import { ApolloProvider } from "react-apollo"
import store from "./utilities/storage/store"
import TopLevelComponent from "./screens/EntryScreen"
import Routing, { Router } from "./utilities/routing"
const Route = Routing.Route
const Link = Routing.Link
import { View, Platform, Text } from "react-native"

import gql from "graphql-tag"
import { query, mutate } from "./utilities/gql_util"

import Stack from "react-router-native-stack"

import { client } from "./utilities/apollo"

import Home from "./screens/Home"
import Group from "./screens/Group"
import Chat from "./screens/Chat"
import User from "./screens/User"

import UserLogin from "./screens/UserLogin"
import UserCreate from "./screens/UserCreate"

class App extends React.Component {
  renderMobileRouting() {
    return (
      <View style={{ flex: 1 }}>
        <Stack>
          <Route exact path="/" component={Home} />
          <Route path="/+:group/" component={Group} />
          <Route path="/+:group/#:chat" component={Chat} />
          <Route path="/@:id" component={User} />
          <Route path="/login" component={UserLogin} />
        </Stack>
      </View>
    )
  }

  renderWebRouting() {
    return (
      <View>
        <Route path="/" component={TopLevelComponent} />
        <Route path="/next" component={TopLevelComponent} />
      </View>
    )
  }

  componentDidMount() {}

  renderRouting() {
    switch (Platform.OS) {
      case "ios":
        return this.renderMobileRouting()
      case "web":
        return this.renderWebRouting()
    }
  }

  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <Provider store={store}>{this.renderRouting()}</Provider>
        </ApolloProvider>
      </Router>
    )
  }
}

export default App
