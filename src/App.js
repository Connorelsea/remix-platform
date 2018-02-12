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
import MediaQuery from "react-responsive"
import styles from "./utilities/styles"
import { connect } from "react-redux"
import User from "./ducks/user"
import { spring, AnimatedSwitch } from "react-router-transition"

const Route = Routing.Route

// we need to map the `scale` prop we define below
// to the transform style property
function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  }
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  })
}

// child matches will...
const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
}

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

  @bind
  renderWithUser() {
    const { user } = this.props
    const Stack = require("react-router-native-stack").default
    /* <Route exact path="/@:id" component={User} /> */

    console.log("WITH USER")

    const routes = [
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
    return (
      <Stack>
        <Route exact path="/" component={Dashboard} />
        {routes}
      </Stack>
    )

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
          <Stack>
            <Route exact path="/" component={Dashboard} />
            {routes}
          </Stack>
        </MediaQuery>
      </View>
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

const Side = styled.View`
  width: 400;
  min-width: 400;
  border-right-color: ${styles.colors.grey[200]};
  border-right-width: 1px;
`

const Body = styled.View`
  flex: 1;
`
