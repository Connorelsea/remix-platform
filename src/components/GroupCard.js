import React, { Component } from "react"
import { withRouter } from "react-router"
import styles from "../utilities/styles"
import styled from "styled-components/native"
import Text from "../components/Text"
import distanceInWords from "date-fns/distance_in_words"
import Option from "../components/Option"
import { bind } from "decko"
import { mutate } from "../utilities/gql_util"
import { TouchableOpacity } from "react-native"

class GroupCard extends Component {
  render() {
    const { id, iconUrl, name, description } = this.props.group
    const { user } = this.props

    let title = name

    if (title === "friend") {
      console.log(description)
      let friend = description
        .trim()
        .split(",")
        .map(part => {
          let sub = part.split(":")
          return { id: sub[0], name: sub[1] }
        })
        .filter(part => part.id !== user.id)

      console.log(friend)

      title = friend[0].name
    }

    return (
      <TouchableOpacity>
        <Card>
          <Text tier="title">{title}</Text>
        </Card>
      </TouchableOpacity>
    )
  }
}

const Card = styled.View`
  background-color: white;
  padding: 16px 18px;
  border-radius: 8px;
  shadow-color: black;
  shadow-radius: 8px;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.09;
  margin-bottom: 20px;
`

export default withRouter(GroupCard)
