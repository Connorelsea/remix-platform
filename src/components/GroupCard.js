import React, { Component } from "react"
import { withRouter } from "react-router"
import styled from "styled-components/native"
import Text from "../components/Text"
import { bind } from "decko"
import { TouchableOpacity } from "react-native"
import styles from "../utilities/styles"
import Card from "../components/Card"
import Spacing from "./Spacing"

class GroupCard extends Component {
  @bind
  onPress() {
    const { id } = this.props.group
    this.props.history.push(`/+${id}`)
  }

  render() {
    const { id, iconUrl, name, description } = this.props.group
    const { user } = this.props

    let title = name

    if (title === "friend") {
      let friend = description
        .trim()
        .split(",")
        .map(part => {
          let sub = part.split(":")
          return { id: sub[0], name: sub[1] }
        })
        .filter(part => part.id !== user.id)

      title = friend[0].name
    }

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card>
          <Header>
            <Image
              source={{
                uri:
                  iconUrl || "https://www.arete.net/Content/Images/nopic.jpg",
              }}
            />
            <Spacing size={15} />
            <Text tier="title">{title}</Text>
          </Header>
        </Card>
      </TouchableOpacity>
    )
  }
}

export default withRouter(GroupCard)

const imageSize = 90

const Image = styled.Image`
  height: ${imageSize}px;
  width: ${imageSize}px;
  border-radius: ${imageSize / 2};
  background-color: ${styles.colors.grey[100]};
  overflow: hidden;
`

const Header = styled.View`
  flex-direction: row;
`
