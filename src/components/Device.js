import React, { Component } from "react"
import Card from "./Card"
import Text from "./Text"
import Button from "./Button"
import { View } from "react-native"
import Spacing from "./Spacing"

export default class Device extends Component {
  render() {
    const {
      id,
      user: { name, email, username, ...user },
      refreshToken,
      accessToken,
    } = this.props
    return (
      <Card small>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <Text tier="title">{name}</Text>
            <Text tier="subtitle">{username}</Text>
          </View>
          <Spacing size={20} />
          <Button small onPress={() => {}} title="Login" />
        </View>
      </Card>
    )
  }
}
