import React, { Component, Fragment, type Node } from "react";
import { connect } from "react-redux";
import ScrollContainer from "../../elements/ScrollContainer";
import ContentContainer from "../../elements/ContentContainer";
import Paragraph from "../../elements/Paragraph";
import Title from "../../elements/Title";
import TextInput from "../../elements/TextInput";
import { bind, memoize } from "decko";
import Box from "../../elements/Box.web";
import Spacing from "../../components/Spacing";
import { withTheme } from "styled-components";
import { type Theme } from "../../utilities/theme";
import Button from "../../elements/Button";
import { query } from "../../utilities/gql_util";
import { type User } from "../../types/user";
import { type Group } from "../../types/group";
import user from "../../ducks/user";
import UserCard from "../../cards/UserCard";
import GroupCard from "../../cards/GroupCard";
import QuickIcons from "../../components/QuickIcons";

type Props = {
  theme: Theme,
};

type State = {
  input: string,
  users: Array<User>,
  groups: Array<Group>,
};

class NewTab extends Component<Props, State> {
  state = {
    input: "",
    users: [],
    groups: [],
  };

  textInput: ?HTMLInputElement;

  @bind
  onChange(event) {
    const input = event.target.value.trim();

    if (input === "")
      return this.setState({ users: [], groups: [], input: "" });

    this.setState({
      input,
    });

    this.search(input);
  }

  @bind
  async search(input) {
    const { apolloClient } = this.props;

    const results = await query(
      `
        query search($phrase: String!) {
          search(phrase: $phrase) {
            users {
              id
              name
              username
              description
              iconUrl
              color
            }
            groups {
              id
              name
              username
              description
              iconUrl
            }
          }
        }
      `,
      { phrase: input },
      apolloClient
    );

    this.setState({
      ...results.data.search,
    });
  }

  render(): Node {
    const { users, groups } = this.state;
    const { theme } = this.props;

    return (
      <ContentContainer backgroundColor={theme.background.secondary}>
        <Box column alignCenter padding="20px" fullWidth>
          <Spacing size={40} />
          <Title type="BOLD" size="LARGE">
            Remix
          </Title>
          <Spacing size={20} />

          <TextInput
            value={this.state.input}
            placeholder="Search for users, groups, or websites"
            onChange={this.onChange}
            innerRef={textInput => (this.textInput = textInput)}
          />
          <Spacing size={20} />

          <QuickIcons />

          <Box column alignStart fullWidth>
            {users !== undefined &&
              users.length !== 0 && (
                <Fragment>
                  <Title type="BOLD" size="SMALL">
                    Users
                  </Title>
                  <Spacing size={10} />

                  {users.map(user => (
                    <Fragment>
                      <UserCard user={user} />
                      <Spacing size={20} />
                    </Fragment>
                  ))}
                </Fragment>
              )}

            {groups !== undefined &&
              groups.length !== 0 && (
                <Fragment>
                  <Title type="BOLD" size="SMALL">
                    Groups
                  </Title>
                  <Spacing size={10} />

                  {groups.map(group => (
                    <Fragment>
                      <GroupCard group={group} />
                      <Spacing size={20} />
                    </Fragment>
                  ))}
                </Fragment>
              )}
          </Box>

          <Spacing size={20} />
        </Box>
      </ContentContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    apolloClient: state.auth.apolloClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(NewTab));
