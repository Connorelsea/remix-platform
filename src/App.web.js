import React from "react"

import Routing, { Router } from "./utilities/routing"
import { Platform, Text, View } from "react-native"
import styled from "styled-components/native"
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
import { Switch } from "react-router"
import styles from "./utilities/styles"
import { connect } from "react-redux"
import User from "./ducks/user"
import Media from "react-media"

const Route = Routing.Route

class App extends React.Component {
  @bind
  renderWithoutUser() {
    // const Stack = require("react-router-native-stack").default

    console.log("WITHOUT USER")

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

  routes = [
    <Route exact path="/+:group/" key="group_show" component={Group} />,
    <Route exact path="/+:group/:chat" key="chat_show" component={Chat} />,
    <Route exact path="/new/friend" key="new_friend" component={FriendNew} />,
    <Route exact path="/new/group" key="new_group" component={GroupNew} />,
    <Route
      exact
      path="/new/group/create"
      key="new_group_create"
      component={GroupCreate}
    />,
  ]

  @bind
  renderWithUser() {
    return (
      <Media query="(max-width: 999px)">
        {matches => (matches ? this.renderMobile() : this.renderDesktop())}
      </Media>
    )
  }

  renderMobile() {
    return (
      <View style={{ flex: 1 }}>
        <Route exact path="/" component={Dashboard} />
        {this.routes}
      </View>
    )
  }

  renderDesktop() {
    return (
      <DesktopContainer>
        <DesktopColumn>
          <Route path="/" component={Dashboard} />
        </DesktopColumn>
        <DesktopColumn>
          <Route path="/+:group/" key="group_show" component={Group} />
        </DesktopColumn>
        <DesktopSpace>
          <Route exact path="/+:group/:chat" key="chat_show" component={Chat} />
        </DesktopSpace>
      </DesktopContainer>
    )
  }

  @bind
  renderRouting() {
    const { isAuthenticated, loading } = this.props
    if (loading) return <Text>Loading</Text>
    if (isAuthenticated) return this.renderWithUser()
    else return this.renderWithoutUser()
  }

  render() {
    return <Router>{this.renderRouting()}</Router>
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    isAuthenticated: User.selectors.isAuthenticated(state),
    loading: state.user.loading,
    friendRequests: state.user.friendRequests,
    groups: state.user.groups,
  }
}

export default connect(mapStateToProps, undefined)(App)

const DesktopContainer = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
`

const DesktopColumn = styled.View`
  min-width: 200px;
  width: 25%;
`

const DesktopSpace = styled.View`
  display: flex;
  flex: 1;
`
