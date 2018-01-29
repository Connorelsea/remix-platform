import React from "react"
import { Provider } from "react-redux"
import { ApolloProvider } from "react-apollo"
import store from "./utilities/storage/store"
import Routing, { Router } from "./utilities/routing"
import { Platform, Text, View } from "react-native"
import styled from "styled-components/native"

import { query } from "./utilities/gql_util"
import { remove } from "./utilities/storage"

import { client } from "./utilities/apollo"

import Home from "./screens/Home"
import Group from "./screens/Group"
import Chat from "./screens/Chat"
import Dashboard from "./screens/Dashboard"

import UserLogin from "./screens/UserLogin"
import UserCreate from "./screens/UserCreate"
import FriendNew from "./screens/FriendNew"
import GroupNew from "./screens/GroupNew"
import GroupCreate from "./screens/GroupCreate"

import { bind } from "decko"
import { get } from "./utilities/storage"

import { Switch } from "react-router"
import { hot } from "react-hot-loader"
import MediaQuery from "react-responsive"
import styles from "./utilities/styles"
import DataManager from "./components/DataManager"

const Route = Routing.Route

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
    // const Stack = require("react-router-native-stack").default

    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/login"
          component={() => <UserLogin setUser={this.setUser} />}
        />
        <Route exact path="/create" component={UserCreate} />
      </Switch>
    )
  }

  @bind
  renderWithUser() {
    const { user } = this.state
    // const Stack = require("react-router-native-stack").default
    /* <Route exact path="/@:id" component={User} /> */

    const routes = [
      <Route exact path="/+:group/" key="group_show" component={Group} />,
      <Route
        exact
        path="/+:group/:chat"
        key="chat_show"
        component={() => <Chat currentUser={user} />}
      />,
      <Route
        exact
        path="/new/friend"
        key="new_friend"
        component={() => <FriendNew user={user} />}
      />,
      <Route
        exact
        path="/new/group"
        key="new_group"
        component={() => <GroupNew user={user} />}
      />,
      <Route
        exact
        path="/new/group/create"
        key="new_group_create"
        component={() => <GroupCreate user={user} />}
      />,
    ]

    return (
      <View style={{ flex: 1 }}>
        <MediaQuery minDeviceWidth={1224}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Side>
              <Dashboard user={user} />
            </Side>
            <Body>{routes}</Body>
          </View>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1224}>
          <Route exact path="/" component={() => <Dashboard user={user} />} />
          {routes}
        </MediaQuery>
      </View>
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
    return <Text>On the web</Text>
  }

  @bind
  async checkLogin() {
    console.log("[AUTH] Checking authentication")

    const token = await get("token")
    const id = await get("userId")
    let data

    console.log(token, id)

    try {
      data = await query(`{ User(id: ${id}) { id } }`)
    } catch (e) {
      remove("token")
      remove("userId")
      console.log("errorrrr")
      console.log(JSON.stringify(e))
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
      default:
      case "web":
        // return this.renderWebRouting()
        return this.renderMobileRouting()
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <DataManager user={this.state.user}>
            <Router>{this.renderRouting()}</Router>
          </DataManager>
        </ApolloProvider>
      </Provider>
    )
  }

  // async registerPushNotifs() {
  //   const { status: { existingStatus } } = await Permissions.getAsync(
  //     Permissions.NOTIFICATIONS
  //   )
  //   let finalStatus = existingStatus

  //   if (existingStatus !== "granted") {
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
  //     finalStatus = status
  //   }

  //   if (finalStatus !== "granted") {
  //     return
  //   }

  //   let token = await Notifications.getExpoPushTokenAsync()
  // }
}

export default hot(module)(App)

const Side = styled.View`
  width: 400;
  min-width: 400;
  border-right-color: ${styles.colors.grey[200]};
  border-right-width: 1px;
`

const Body = styled.View`
  flex: 1;
`
