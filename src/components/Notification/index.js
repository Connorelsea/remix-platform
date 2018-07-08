import React, { Component, Fragment, type Node } from "react";
import styled, { withTheme } from "styled-components";
import Paragraph from "../../elements/Paragraph";
import { type User } from "../../types/user";
import Box from "../../elements/Box";
import Button from "../../elements/Button";
import distanceInWords from "date-fns/distance_in_words";
import Spacing from "../Spacing";
import { type Group } from "../../types/group";

export type NotificationType =
  | "GROUP_INVITATION"
  | "FRIEND_REQUEST"
  | "ONBOARDING";

type Props = {
  fromUser?: User,
  forGroup?: Group,
  type: NotificationType,
  createdAt: string,
  acceptText?: string,
  denyText?: string,
  acceptAction?: any => any,
  denyAction?: any => any,
  title?: string,
  subtitle?: string,
};

class Notification extends Component<Props> {
  static defaultProps = {
    fromUser: undefined,
    forGroup: undefined,
    acceptText: "Accept",
    denyText: "Deny",
    title: undefined,
    subtitle: undefined,
  };

  acceptFriendRequest() {
    const acceptFriendRequestQuery = `
      mutation acceptFriendRequest {
        acceptFriendRequest(friendRequestId: 1)
      }
    `;
  }

  acceptGroupInvitation() {
    const acceptGroupInvitationQuery = `
      mutation acceptGroupInvitation($invitationId: ID!) {
        acceptGroupInvitation(invitationId: $invitationId) {
          id
          members { id }
        }
      }
    `;
  }

  render(): Node {
    const {
      fromUser,
      forGroup,
      type,
      createdAt,
      theme,
      acceptText,
      denyText,
      title,
    } = this.props;
    console.log(createdAt);
    return (
      <Container>
        <Box column justifyAround>
          {type === "GROUP_INVITATION" && (
            <Fragment>
              <Paragraph fontSize={16}>
                <Strong>Invitation</Strong> from
                <Strong>{" " + fromUser.name}</Strong>
              </Paragraph>
              <Paragraph fontSize={16}>{forGroup.name}</Paragraph>
            </Fragment>
          )}

          {type === "FRIEND_REQUEST" && (
            <Fragment>
              <Paragraph fontSize={16}>
                <Strong>Friend Request</Strong> from
                <Strong>{" " + fromUser.name}</Strong>
              </Paragraph>
            </Fragment>
          )}

          {type === "ONBOARDING" && (
            <Fragment>
              <Paragraph fontSize={16}>{title}</Paragraph>
            </Fragment>
          )}

          <Paragraph fontSize={14} color={theme.text.tertiary}>
            {distanceInWords(new Date(), new Date(createdAt))} ago
          </Paragraph>
        </Box>
        <Spacing size={10} />
        <Box column>
          <Button size="SMALL" type="CLEAR" title={acceptText} />
          <Button size="SMALL" type="CLEAR" title={denyText} />
        </Box>
      </Container>
    );
  }
}

const Strong = styled.span`
  font-weight: 700;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${p => p.theme.background.tertiary};
  border-radius: 8px;
  padding: 10px 14px;
`;

export default withTheme(Notification);
