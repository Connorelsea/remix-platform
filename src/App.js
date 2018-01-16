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
import Dashboard from "./screens/Dashboard"

import UserLogin from "./screens/UserLogin"
import UserCreate from "./screens/UserCreate"
import UserCreateDone from "./screens/UserCreateDone"

import { bind } from "decko"
import { get } from "./utilities/storage"

class App extends React.Component {
  state = {
    user: undefined,
    loading: true,
  }

  @bind
  setUser(user) {
    this.setState({ user })
  }

  @bind
  renderWithoutUser() {
    return (
      <Stack>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/login"
          component={() => <UserLogin setUser={this.setUser} />}
        />
        <Route exact path="/create" component={UserCreate} />
        <Route exact path="/create/done" component={UserCreateDone} />
      </Stack>
    )
  }

  @bind
  renderWithUser() {
    const { user } = this.state
    return (
      <Stack>
        <Route
          exact
          path="/"
          component={() => <Dashboard user={user} />}
          animationType="slide-vertical"
        />
        <Route path="/+:group/" component={Group} />
        <Route path="/+:group/#:chat" component={Chat} />
        <Route path="/@:id" component={User} />
      </Stack>
    )
  }

  @bind
  renderMobileRouting() {
    const { user, loading } = this.state
    if (loading) return <Text>Loading</Text>
    if (user) return this.renderWithUser()
    else return this.renderWithoutUser()
  }

  renderWebRouting() {
    return
  }

  @bind
  async checkLogin() {
    console.log("[AUTH] Checking authentication")

    const token = await get("token")
    const id = await get("userId")
    let data

    try {
      data = await query(
        client,
        `
        { User(id: ${id}) { id } }
      `
      )
    } catch (e) {
      console.error(e)
    }

    if (data) {
      console.log("[AUTH] User is authenticated")
      this.setState({
        loading: false,
        user: {
          id,
          token,
        },
      })
    } else {
      console.log("[AUTH] User is not authenticated")
      this.setState({ loading: false, user: undefined })
    }
  }

  componentDidMount() {
    this.checkLogin()
  }

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
      <ApolloProvider client={client}>
        <Router>
          {/* <Provider store={store}>{this.renderRouting()}</Provider> */}
          {this.renderRouting()}
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
