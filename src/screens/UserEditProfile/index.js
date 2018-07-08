import React, { Component, Fragment, type Node } from "react";
import { withTheme } from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import ProvideUsers from "../../providers/ProvideUsers";

import Box from "../../elements/Box.web";
import Button from "../../elements/Button";
import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";
import Paragraph from "../../elements/Paragraph";
import Subtitle from "../../elements/Subtitle";
import Title from "../../elements/Title";

import Spacing from "../../components/Spacing";
import Icon from "../../components/Icon";

import { type User } from "../../types/user";

import { buildEditUserUrl, buildUserUrl } from "../../utilities/urls";
import EditableText from "../../elements/EditableText";

type Props = {
  user: User,
};

type State = {
  newName: string,
  newUsername: string,
  newDescription: string,
};

class UserEditProfile extends Component<Props, State> {
  state = {
    newName: undefined,
    newUsername: undefined,
    newDescription: undefined,
  };

  render(): Node {
    const { match, theme, group, currentUserId } = this.props;
    const { newName, newUsername, newDescription } = this.state;
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

          return (
            <ScrollContainer>
              <ContentContainer>
                <Box fullWidth column>
                  <Box
                    fullWidth
                    padding="20px"
                    backgroundColor={theme.background.primary}
                  >
                    <Box minWidth={150}>
                      <Icon iconUrl={user.iconUrl} iconSize={150} />
                    </Box>

                    <Spacing size={25} />

                    <Box fullWidth column>
                      <EditableText
                        editing
                        themeColor="primary"
                        themeFontSize="title_lg"
                        fontWeight={900}
                        onChange={e => {
                          console.log("VALUE", e.target.value);
                          this.setState({ newName: e.target.value });
                        }}
                      >
                        {newName !== undefined ? newName : user.name}
                      </EditableText>
                      <Spacing size={10} />

                      <EditableText
                        editing
                        themeColor="tertiary"
                        themeFontSize="subtitle"
                        onChange={e => {
                          console.log("VALUE", e.target.value);
                          this.setState({ newUsername: e.target.value });
                        }}
                      >
                        {newUsername !== undefined
                          ? newUsername
                          : user.username}
                      </EditableText>

                      <Spacing size={10} />

                      <EditableText
                        editing
                        themeColor="secondary"
                        themeFontSize="subtitle"
                        onChange={e => {
                          console.log("VALUE", e.target.value);
                          this.setState({ newDescription: e.target.value });
                        }}
                      >
                        {newDescription !== undefined
                          ? newDescription
                          : user.description}
                      </EditableText>

                      <Box justifyEnd>
                        <Button
                          size="MEDIUM"
                          type="DEFAULT"
                          title="Cancel"
                          to={buildUserUrl(user)}
                        />
                        <Spacing size={10} />
                        {(newDescription || newUsername || newName) && (
                          <Button
                            size="MEDIUM"
                            type="EMPHASIS"
                            title="Save Profile"
                            to={buildUserUrl(user)}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </ContentContainer>
            </ScrollContainer>
          );
        }}
      />
    );
  }
}
function mapStateToProps(state, props) {
  return {
    currentUserId: state.identity.currentUserId,
    apolloClient: state.auth.apolloClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(UserEditProfile))
);
