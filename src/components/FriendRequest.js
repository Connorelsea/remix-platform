import React, { Component } from "react";
import { withRouter } from "react-router";
import styles from "../utilities/styles";
import styled from "styled-components/native";
import Text from "../components/Text";
import distanceInWords from "date-fns/distance_in_words";
import Option from "../components/Option";
import { bind } from "decko";
import { mutate } from "../utilities/gql_util";
import Spacing from "./Spacing";

class FriendRequest extends Component {
  state = {
    focus: false,
    accepted: false
  };

  @bind
  onFocus() {
    this.setState({ focus: true });
  }

  @bind
  onFocusOut() {
    this.setState({ focus: false });
  }

  @bind
  onAcceptPress(id) {
    const { removeFriendRequest } = this.props;

    return async () => {
      setTimeout(() => removeFriendRequest(id), 2000);

      let request = await mutate(
        `
        mutation($friendRequestId: ID!) {
          acceptFriendRequest(friendRequestId: $friendRequestId) 
        }
      `,
        { friendRequestId: id }
      );

      this.setState({ accepted: true });
    };
  }

  render() {
    const { createdAt, fromUser, id } = this.props;
    const { focus, accepted } = this.state;

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
            {accepted
              ? [<Middle>You are now friends with </Middle>, fromUser.name]
              : [fromUser.name, <Middle> sent a</Middle>, " Friend Request"]}
          </Text>
          <Spacing size={4} />
          <Text tier="requestSubtitle">
            {distanceInWords(new Date(createdAt), new Date())} ago
          </Text>
        </Flex>
        {!accepted && (
          <Option
            options={[
              {
                text: "Accept",
                color: "black",
                action: this.onAcceptPress(id)
              },
              { text: "Deny", color: "rgba(0,0,0,0.5)", action: () => {} }
            ]}
          />
        )}
      </Request>
    );
  }
}

export default withRouter(FriendRequest);

const Flex = styled.View`
  flex-direction: ${props => (props.row ? "row" : "column")};
  flex: 1;
  justify-content: ${props => props.jc || "flex-start"};
  margin-right: 10px;
`;

const Request = styled.View`
  padding: 15px;
  background-color: ${({ focus }) =>
    focus ? styles.colors.grey[300] : styles.colors.grey[200]};
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Middle = styled.Text`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
`;
