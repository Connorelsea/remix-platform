import React, { Component } from "react"
import { withRouter } from "react-router"
import styles from "../utilities/styles"
import styled from "styled-components/native"
import Text from "../components/Text"
import distanceInWords from "date-fns/distance_in_words"
import Option from "../components/Option"
import { bind } from "decko"

class FriendRequest extends Component {
  state = {
    focus: false,
  }

  @bind
  onFocus() {
    this.setState({ focus: true })
  }

  @bind
  onFocusOut() {
    this.setState({ focus: false })
  }

  render() {
    const { createdAt, fromUser } = this.props
    const { focus } = this.state

    return (
      <Request
        onFocus={this.onFocus}
        onBlur={this.onFocusOut}
        onMouseEnter={this.onFocus}
        onMouseLeave={this.onFocusOut}
        focus={focus}
      >
        <Flex jc="space-around">
          <Text tier="requestTitle">
            {fromUser.name} <Middle>sent a</Middle> Friend Request
          </Text>
          <Text tier="requestSubtitle">
            {distanceInWords(new Date(createdAt), new Date())} ago
          </Text>
        </Flex>
        <Option
          options={[
            { text: "Accept", color: "black", action: () => {} },
            { text: "Deny", color: "rgba(0,0,0,0.5)", action: () => {} },
          ]}
        />
      </Request>
    )
  }
}

export default withRouter(FriendRequest)

const Flex = styled.View`
  flex-direction: ${props => (props.row ? "row" : "column")};
  flex: 1;
  justify-content: ${props => props.jc || "flex-start"};
`

const Request = styled.View`
  padding: 15px;
  background-color: ${({ focus }) =>
    focus ? styles.colors.grey[400] : styles.colors.grey[200]};
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`

const Middle = styled.Text`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
`
