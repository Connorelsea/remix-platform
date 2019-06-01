// @flow

import React, { Component, Fragment, type Node } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { bind } from "decko";
import gql from "graphql-tag";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import styled, { withTheme } from "styled-components";

import Title from "../../elements/Title";
import Paragraph from "../../elements/Paragraph";
import Icon from "../../components/Icon/index";
import Box from "../../elements/Box";
import Button from "../../elements/Button";
import Spacing from "../../components/Spacing";

import { type User } from "../../types/user";

import ProvideUsers, {
  type ProvideUsersRenderProps,
} from "../../providers/ProvideUsers";
import Subtitle from "../../elements/Subtitle";
import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";
import { type Theme } from "../../utilities/theme";
import ChatCard from "../Group/ChatCard";
import { getDirectMessageGroup } from "../../ducks/groups";
import { type Group } from "../../types/group";
import { mutate } from "../../utilities/gql_util";
import { ApolloClient } from "apollo-client";
import UserActionButtons from "./UserActionButtons";

import FeatherIcon from "react-native-vector-icons/dist/Feather";

import AzureStorage from "../../utilities/azure-storage.blob.js";

type Props = {
  match: {
    params: any,
  },
  theme: Theme,
  group: Group,
  currentUserId: string,
  apolloClient: ApolloClient,
};

class UserComponent extends Component<Props> {
  @bind
  async newIcon() {
    const { apolloClient } = this.props;

    const src = gql`
      mutation createStorage {
        createStorage {
          sasUrl
        }
      }
    `;

    const response = await mutate(src, undefined, apolloClient);

    const url = response.data.createStorage.sasUrl;

    const blobService = AzureStorage.createBlobService(url);

    console.log("NEW ICON RESPONSE", response);
  }

  @bind
  sendFriendRequest(toUserId: string) {
    const createFriendRequestQuery = `
      mutation($message: String, $fromUserId: ID!, $toUserId: ID!) {
        createFriendRequest(
          message: $message,
          fromUserId: $fromUserId,
          toUserId: $toUserId
        ) {
          id
        }
      }
    `;

    const { currentUserId, apolloClient } = this.props;

    const vars = {
      message: "",
      fromUserId: currentUserId,
      toUserId,
    };

    mutate(createFriendRequestQuery, vars, apolloClient).then(response => {
      console.log("RESPONSE 22222", response);
    });
  }

  sendUnfriend() {}

  render(): Node {
    const { match, theme, group, currentUserId } = this.props;
    const params = match.params;

    return (
      <ProvideUsers
        userNames={[params.username]}
        render={(renderProps: ProvideUsersRenderProps) => {
          const { users, usersLoading } = renderProps;

          if (usersLoading) return "loading";

          if (users && users.length === 0) return "this user not found";
          // if (group === undefined) return "no group";

          let user: User = users[0];

          let iconCircles = [];

          if (user.id === currentUserId) {
            iconCircles.push({
              color: theme.colors.blue,
              onClick: this.newIcon,
              right: -5,
              bottom: 1,
              children: (
                <FeatherIcon
                  name="plus"
                  size={22}
                  color={theme.background.primary}
                />
              ),
            });
          }

          return (
            <ReflexContainer orientation="horizontal">
              <ReflexElement>
                <Scroller>
                  <Box
                    fullWidth
                    padding="20px"
                    backgroundColor={theme.background.primary}
                  >
                    <Box minWidth={150}>
                      <Icon
                        iconUrl={user.iconUrl}
                        iconSize={150}
                        circles={iconCircles}
                      />
                    </Box>

                    <Spacing size={25} />

                    <Box fullWidth column>
                      <Title type="BOLD" size="LARGE">
                        {user.name}
                      </Title>
                      <Spacing size={10} />

                      <Subtitle>@{user.username}</Subtitle>
                      <Spacing size={10} />
                      <Paragraph>{user.description}</Paragraph>
                      <Box justifyEnd>
                        <UserActionButtons
                          user={user}
                          group={group}
                          currentUserId={currentUserId}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Scroller>
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement>
                {group !== undefined ? (
                  <Scroller>
                    <Box
                      fullWidth
                      minHeight
                      column
                      padding="20px"
                      backgroundColor={theme.background.secondary}
                    >
                      {group.chats.map(chat => [
                        <ChatCard group={group} chat={chat} key={chat.id} />,
                        <Spacing size={20} />,
                      ])}
                    </Box>
                  </Scroller>
                ) : (
                  <Box
                    fullWidth
                    column
                    padding="20px"
                    backgroundColor={theme.background.secondary}
                  >
                    <Paragraph>To begin chatting, add as a friend</Paragraph>
                  </Box>
                )}
              </ReflexElement>
            </ReflexContainer>
          );
        }}
      />
    );
  }
}

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

function mapStateToProps(state, props) {
  return {
    group: getDirectMessageGroup(state, props.match.params.username),
    currentUserId: state.identity.currentUserId,
    apolloClient: state.auth.apolloClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(UserComponent))
);
